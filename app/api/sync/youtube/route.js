import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Server-side Supabase client using the service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Find this user's YouTube link
    const { data: link, error: linkError } = await supabase
      .from('social_links')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'YouTube')
      .single();

    if (linkError || !link) {
      return NextResponse.json(
        { error: 'No YouTube channel linked for this user' },
        { status: 404 }
      );
    }

    // Cooldown: don't allow re-sync within 5 minutes (saves API quota)
    if (link.last_updated) {
      const lastSync = new Date(link.last_updated).getTime();
      const minutesSince = (Date.now() - lastSync) / 1000 / 60;
      if (minutesSince < 5) {
        return NextResponse.json(
          { error: `Synced ${Math.round(minutesSince)} min ago. Try again in a few minutes.` },
          { status: 429 }
        );
      }
    }

    // Resolve the URL to a YouTube channel ID
    const channelId = await resolveChannelId(link.url);
    if (!channelId) {
      return NextResponse.json(
        { error: 'Could not find that YouTube channel. Check the URL.' },
        { status: 400 }
      );
    }

    // Fetch the actual subscriber count
    const stats = await fetchChannelStats(channelId);
    if (!stats) {
      return NextResponse.json(
        { error: 'Failed to fetch channel stats from YouTube' },
        { status: 500 }
      );
    }

    // Update the social_links row with fresh count
    const { error: updateError } = await supabase
      .from('social_links')
      .update({
        followers: stats.subscriberCount,
        last_updated: new Date().toISOString(),
      })
      .eq('id', link.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to save updated count' },
        { status: 500 }
      );
    }

    // Log it to score_history
    await supabase.from('score_history').insert({
      user_id: userId,
      platform: 'YouTube',
      followers: stats.subscriberCount,
    });

    return NextResponse.json({
      success: true,
      platform: 'YouTube',
      channelTitle: stats.title,
      followers: stats.subscriberCount,
    });
  } catch (err) {
    console.error('YouTube sync error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Convert a YouTube URL into a channel ID (UC...)
async function resolveChannelId(url) {
  const trimmed = url.trim();

  // Match different YouTube URL formats
  const match = trimmed.match(
    /youtube\.com\/(?:@([^\/\?\s]+)|channel\/([^\/\?\s]+)|c\/([^\/\?\s]+)|user\/([^\/\?\s]+))/
  );

  if (!match) return null;

  // Already a direct channel ID
  if (match[2]) return match[2];

  // Handle (@username) — use the modern forHandle endpoint
  if (match[1]) {
    return await lookupByHandle('@' + match[1]);
  }

  // Legacy /c/ or /user/ URLs — fall back to search
  if (match[3] || match[4]) {
    return await lookupBySearch(match[3] || match[4]);
  }

  return null;
}

async function lookupByHandle(handle) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(
    handle
  )}&key=${process.env.YOUTUBE_API_KEY}`;
  const res = await fetch(apiUrl);
  if (!res.ok) return null;
  const data = await res.json();
  return data.items?.[0]?.id ?? null;
}

async function lookupBySearch(query) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
    query
  )}&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`;
  const res = await fetch(apiUrl);
  if (!res.ok) return null;
  const data = await res.json();
  return data.items?.[0]?.snippet?.channelId ?? null;
}

async function fetchChannelStats(channelId) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`;
  const res = await fetch(apiUrl);
  if (!res.ok) return null;
  const data = await res.json();
  const channel = data.items?.[0];
  if (!channel) return null;

  return {
    title: channel.snippet.title,
    subscriberCount: parseInt(channel.statistics.subscriberCount, 10),
    hidden: channel.statistics.hiddenSubscriberCount === true,
  };
}