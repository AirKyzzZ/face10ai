import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { rateLimit, RATE_LIMITS, getClientIp } from './lib/rate-limit'

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing)

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

// Helper to extract pathname without locale prefix
function getPathnameWithoutLocale(pathname: string): string {
  const locales = ['en', 'fr']
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.replace(`/${locale}`, '') || '/'
    }
  }
  return pathname
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip i18n for API routes, static files, and internal Next.js paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/models/') ||
    pathname.includes('.') // static files like favicon.ico, etc.
  ) {
    // Apply rate limiting to API routes
    if (pathname.startsWith('/api/')) {
      const rateLimitResponse = handleRateLimit(request)
      if (rateLimitResponse) {
        return rateLimitResponse
      }
    }
    return NextResponse.next()
  }

  // Get the pathname without locale for auth checks
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname)

  // Protect dashboard routes (check before i18n redirect)
  if (pathnameWithoutLocale.startsWith('/dashboard')) {
    const token = await getToken({ req: request })
    if (!token) {
      // Redirect to sign in with the current locale
      const locale = pathname.split('/')[1]
      const isValidLocale = ['en', 'fr'].includes(locale)
      const signInPath = isValidLocale ? `/${locale}/auth/signin` : '/en/auth/signin'
      const signInUrl = new URL(signInPath, request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for specific patterns
  matcher: [
    // Match all pathnames except for
    // - /api routes
    // - /_next (Next.js internals)
    // - /models (static model files)
    // - Files with extensions (.ico, .png, etc.)
    '/((?!api|_next|models|.*\\..*).*)',
    // Also match API routes for rate limiting
    '/api/:path*',
  ],
}
