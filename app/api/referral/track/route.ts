import { NextRequest, NextResponse } from 'next/server'
import { trackReferral } from '@/lib/referrals'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referralCode, newUserId } = body

    if (!referralCode || !newUserId) {
      return NextResponse.json(
        { error: 'Code de parrainage ou ID utilisateur manquant' },
        { status: 400 }
      )
    }

    await trackReferral(referralCode, newUserId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking referral:', error)
    return NextResponse.json(
      { error: 'Erreur lors du suivi du parrainage' },
      { status: 500 }
    )
  }
}

