import { cookies } from 'next/headers'
import { prisma } from './prisma'

const ANONYMOUS_SESSION_COOKIE = 'anonymous_session_id'
const MAX_ANONYMOUS_RATINGS = 1

export async function getOrCreateAnonymousSession(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get(ANONYMOUS_SESSION_COOKIE)?.value

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    cookieStore.set(ANONYMOUS_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    await prisma.anonymousSession.create({
      data: {
        sessionId,
        ratingsUsed: 0,
      },
    })
  }

  return sessionId
}

export async function canUseAnonymousRating(sessionId: string): Promise<boolean> {
  const session = await prisma.anonymousSession.findUnique({
    where: { sessionId },
  })

  if (!session) {
    return true
  }

  return session.ratingsUsed < MAX_ANONYMOUS_RATINGS
}

export async function incrementAnonymousRating(sessionId: string): Promise<void> {
  await prisma.anonymousSession.upsert({
    where: { sessionId },
    update: {
      ratingsUsed: { increment: 1 },
    },
    create: {
      sessionId,
      ratingsUsed: 1,
    },
  })
}

export async function getAnonymousRatingsRemaining(sessionId: string): Promise<number> {
  const session = await prisma.anonymousSession.findUnique({
    where: { sessionId },
  })

  if (!session) {
    return MAX_ANONYMOUS_RATINGS
  }

  return Math.max(0, MAX_ANONYMOUS_RATINGS - session.ratingsUsed)
}
