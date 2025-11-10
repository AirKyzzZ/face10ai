import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { checkCredits } from '@/lib/credits'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ credits: 0, authenticated: false })
    }

    const credits = await checkCredits(session.user.id)

    return NextResponse.json({
      credits,
      authenticated: true,
    })
  } catch (error) {
    console.error('Error checking credits:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification des crédits' },
      { status: 500 }
    )
  }
}

