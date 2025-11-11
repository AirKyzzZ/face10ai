import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ResultClient from './ResultClient'

export default async function ResultPage({ params }: { params: { id: string } }) {
  const rating = await prisma.rating.findUnique({
    where: { id: params.id },
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
