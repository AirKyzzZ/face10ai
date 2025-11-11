import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { checkCredits } from '@/lib/credits'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const credits = await checkCredits(session.user.id)

    return NextResponse.json({
      credits,
    })
  } catch (error) {
    console.error('Check credits error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification des crédits' },
      { status: 500 }
    )
  }
}
