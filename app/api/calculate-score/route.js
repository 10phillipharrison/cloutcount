import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { user_id } = await request.json()

    // Get all social links for this user
    const { data: socials } = await supabase
      .from('social_links')
      .select('*')
      .eq('user_id', user_id)

    if (!socials || socials.length === 0) {
      return NextResponse.json({ score: 0 })
    }

    // Calculate score — 1pt per follower, 2pts for paid platforms
    let totalScore = 0
    for (const social of socials) {
      const multiplier = social.is_paid ? 2 : 1
      const points = (social.followers || 0) * multiplier
      totalScore += points

      // Update points for this social link
      await supabase
        .from('social_links')
        .update({ points })
        .eq('id', social.id)
    }

    // Get all users sorted by score for ranking
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, cloutcount_score, city, state, country')
      .order('cloutcount_score', { ascending: false })

    // Get current user profile
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('city, state, country')
      .eq('id', user_id)
      .single()

    // Calculate ranks
    const worldRank = allProfiles.findIndex(p => p.id === user_id) + 1

    const sameCountry = allProfiles.filter(p => p.country === userProfile?.country)
    const countryRank = sameCountry.findIndex(p => p.id === user_id) + 1

    const sameState = allProfiles.filter(p => p.state === userProfile?.state)
    const stateRank = sameState.findIndex(p => p.id === user_id) + 1

    const sameCity = allProfiles.filter(p => p.city === userProfile?.city)
    const cityRank = sameCity.findIndex(p => p.id === user_id) + 1

    // Update profile with new score and ranks
    await supabase
      .from('profiles')
      .update({
        cloutcount_score: totalScore,
        world_rank: worldRank,
        country_rank: countryRank,
        state_rank: stateRank,
        city_rank: cityRank,
      })
      .eq('id', user_id)

    // Save score history
    await supabase
      .from('score_history')
      .insert({
        user_id,
        score: totalScore,
        world_rank: worldRank,
        country_rank: countryRank,
        state_rank: stateRank,
        city_rank: cityRank,
      })

    return NextResponse.json({
      score: totalScore,
      world_rank: worldRank,
      country_rank: countryRank,
      state_rank: stateRank,
      city_rank: cityRank,
    })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}