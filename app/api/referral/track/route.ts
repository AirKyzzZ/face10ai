import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referralCode } = body

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Code de parrainage requis' },
        { status: 400 }
      )
    }

    // Validate referral code exists
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
      select: { id: true, name: true },
    })

    if (!referrer) {
      return NextResponse.json(
        { error: 'Code de parrainage invalide' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      valid: true,
      referrerName: referrer.name,
    })
  } catch (error) {
    console.error('Track referral error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la validation du code' },
      { status: 500 }
    )
  }
}
