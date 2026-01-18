import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { rateLimit, RATE_LIMITS, getClientIp } from './lib/rate-limit'

// Rate limiting for API routes
function handleRateLimit(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname
  const ip = getClientIp(request)

  let config: { maxRequests: number; windowMs: number } = RATE_LIMITS.api
  let key = `api:${ip}`

  // Apply specific rate limits based on endpoint
  if (pathname === '/api/signup') {
    config = RATE_LIMITS.signup
    key = `signup:${ip}`
  } else if (pathname.startsWith('/api/auth')) {
    config = RATE_LIMITS.auth
    key = `auth:${ip}`
  } else if (
    pathname === '/api/upload' ||
    pathname === '/api/analyze' ||
    pathname === '/api/analyze-face'
  ) {
    config = RATE_LIMITS.analyze
    key = `analyze:${ip}`
  }

  const result = rateLimit(key, config)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(result.resetIn / 1000)),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
        },
      }
    )
  }

  return null
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitResponse = handleRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ req: request })
    if (!token) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
