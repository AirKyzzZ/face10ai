import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { ResultClient } from './ResultClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const rating = await prisma.rating.findUnique({
    where: { id },
  })

  if (!rating) {
    return {
      title: 'Résultat non trouvé',
    }
  }

  return {
    title: `Score: ${rating.score}/10 - Combien sur 10`,
    description: `Découvrez votre note d'attractivité sur Combien sur 10. Score obtenu: ${rating.score}/10`,
    openGraph: {
      title: `J'ai obtenu ${rating.score}/10 sur Combien sur 10 !`,
      description: 'Découvre ta note d\'attractivité avec notre IA avancée',
    },
  }
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const rating = await prisma.rating.findUnique({
    where: { id },
  })

  if (!rating) {
    notFound()
  }

  return (
    <ResultClient
      rating={rating}
      session={session}
    />
  )
}

