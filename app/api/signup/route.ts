import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { trackReferral } from '@/lib/referrals'
import { addCredits } from '@/lib/credits'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, referralCode } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Initial credits
    const initialCredits = parseInt(process.env.INITIAL_SIGNUP_CREDITS || '5')

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        creditsRemaining: initialCredits,
        authProvider: 'email',
      },
    })

    // Add initial credit transaction
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        amount: initialCredits,
        type: 'signup',
        description: 'Crédits initiaux pour nouveau compte',
      },
    })

    // Track referral if code provided
    if (referralCode) {
      await trackReferral(referralCode, user.id)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}
