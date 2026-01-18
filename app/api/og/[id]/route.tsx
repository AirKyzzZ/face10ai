import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'

// Using Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Fetch the rating from database
    const rating = await prisma.rating.findUnique({
      where: { id },
      select: { score: true },
    })

    const score = rating?.score?.toFixed(1) ?? '?'

    // Determine color based on score
    const scoreNum = rating?.score ?? 5
    let scoreColor = '#ef4444' // red for low
    if (scoreNum >= 7) {
      scoreColor = '#22c55e' // green for high
    } else if (scoreNum >= 5) {
      scoreColor = '#f59e0b' // amber for medium
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage:
              'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)',
          }}
        >
          {/* Logo/Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              face
            </span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#3b82f6',
                letterSpacing: '-0.02em',
              }}
            >
              10
            </span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              ai
            </span>
          </div>

          {/* Score Display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: 180,
                fontWeight: 800,
                color: scoreColor,
                lineHeight: 1,
                textShadow: `0 0 60px ${scoreColor}40`,
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: 60,
                fontWeight: 600,
                color: '#6b7280',
                marginLeft: 10,
              }}
            >
              /10
            </span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: '#9ca3af',
              marginBottom: 40,
            }}
          >
            Score d&apos;attractivité par IA
          </div>

          {/* CTA */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 32px',
              backgroundColor: '#3b82f6',
              borderRadius: 12,
              fontSize: 24,
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            Testez le vôtre gratuitement →
          </div>

          {/* URL */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 24,
              color: '#6b7280',
            }}
          >
            face10ai.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch {
    // Return default image on error
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            face10ai
          </span>
          <span
            style={{
              fontSize: 32,
              color: '#9ca3af',
              marginTop: 20,
            }}
          >
            Analyse IA de votre attractivité
          </span>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}
