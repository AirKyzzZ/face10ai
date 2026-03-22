import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { trackReferral } from '@/lib/referrals'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, referralCode } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
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
        description: 'Initial credits for new account',
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
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
