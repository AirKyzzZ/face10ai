import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ResultClient from './ResultClient'

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
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

  return <ResultClient rating={rating} />
}
