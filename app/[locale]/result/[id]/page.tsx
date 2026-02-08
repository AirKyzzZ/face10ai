import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ResultClient from './ResultClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const rating = await prisma.rating.findUnique({
    where: { id },
    select: { score: true },
  })

  if (!rating) {
    return {
      title: 'Résultat non trouvé',
    }
  }

  const score = rating.score.toFixed(1)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://face10ai.com'

  return {
    title: `Score d'attractivité: ${score}/10`,
    description: `Découvrez mon analyse d'attractivité faciale par IA sur face10ai.com - Score: ${score}/10`,
    openGraph: {
      title: `J'ai obtenu ${score}/10 sur face10ai!`,
      description: 'Testez votre attractivité avec l\'IA la plus avancée. Résultats instantanés et confidentiels.',
      images: [`${appUrl}/api/og/${id}`],
      type: 'website',
      url: `${appUrl}/result/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `J'ai obtenu ${score}/10 sur face10ai!`,
      description: 'Testez votre attractivité avec l\'IA la plus avancée.',
      images: [`${appUrl}/api/og/${id}`],
    },
  }
}

interface Breakdown {
  symmetry: number
  proportions: number
  features: number
  overall: number
}

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params
  const rating = await prisma.rating.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          referralCode: true,
          name: true,
        },
      },
    },
  })

  if (!rating) {
    notFound()
  }

  // Transform the rating to match the expected type
  const transformedRating = {
    id: rating.id,
    score: rating.score,
    gender: rating.gender,
    breakdown: rating.breakdown as unknown as Breakdown,
    createdAt: rating.createdAt,
    user: rating.user,
  }

  return <ResultClient rating={transformedRating} />
}
