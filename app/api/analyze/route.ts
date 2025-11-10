import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { deductCredit } from '@/lib/credits'
import {
  getOrCreateAnonymousSession,
  incrementAnonymousRating,
} from '@/lib/anonymous-tracking'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageHash, gender, score, breakdown } = body

    if (!imageHash || !gender || !score || !breakdown) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Check if rating already exists
    const existingRating = await prisma.rating.findUnique({
      where: { imageHash },
    })

    if (existingRating) {
      return NextResponse.json({
        ratingId: existingRating.id,
        cached: true,
      })
    }

    // Check authentication
    const session = await getServerSession(authOptions)
    let userId: string | null = null

    if (session?.user?.id) {
      // Deduct credit for authenticated user
      userId = session.user.id
      const success = await deductCredit(userId)

      if (!success) {
        return NextResponse.json(
          { error: 'Impossible de déduire le crédit' },
          { status: 500 }
        )
      }
    } else {
      // Increment anonymous usage
      const sessionId = await getOrCreateAnonymousSession()
      await incrementAnonymousRating(sessionId)
    }

    // Save rating to database
    const rating = await prisma.rating.create({
      data: {
        userId,
        imageHash,
        gender,
        score: parseFloat(score),
        breakdown,
      },
    })

    return NextResponse.json({
      ratingId: rating.id,
      success: true,
    })
  } catch (error) {
    console.error('Analyze error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse' },
      { status: 500 }
    )
  }
}

