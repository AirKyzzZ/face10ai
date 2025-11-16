import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { generateImageHash } from '@/lib/image-hash'
import {
  getOrCreateAnonymousSession,
  canUseAnonymousRating,
  incrementAnonymousRating,
} from '@/lib/anonymous-tracking'
import { deductCredit } from '@/lib/credits'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucune image fournie' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Maximum 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer and generate hash
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const imageHash = generateImageHash(buffer)

    // Check if this image has been analyzed before
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
    let canProceed = false

    if (session?.user?.id) {
      // Authenticated user - check credits
      userId = session.user.id
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { creditsRemaining: true },
      })

      if (!user || user.creditsRemaining <= 0) {
        return NextResponse.json(
          { error: 'Crédits insuffisants' },
          { status: 403 }
        )
      }

      canProceed = true
    } else {
      // Anonymous user - check limit
      const sessionId = await getOrCreateAnonymousSession()
      const canUse = await canUseAnonymousRating(sessionId)

      if (!canUse) {
        return NextResponse.json(
          {
            error: 'Limite gratuite atteinte. Créez un compte pour continuer.',
            requiresAuth: true,
          },
          { status: 403 }
        )
      }

      canProceed = true
    }

    if (!canProceed) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Convert buffer to base64 for client-side processing
    const base64Image = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64Image}`

    // Return image data for client-side face detection
    // The actual rating will be calculated on the client and saved via another API
    return NextResponse.json({
      imageHash,
      imageData: dataUrl,
      userId,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement' },
      { status: 500 }
    )
  }
}
