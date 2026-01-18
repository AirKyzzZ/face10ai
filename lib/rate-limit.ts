// Simple in-memory rate limiter
// For production with multiple instances, use Redis (@upstash/ratelimit)

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}, 60000) // Clean every minute

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number
}

export function rateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || entry.resetTime < now) {
    // Create new entry
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    }
  }

  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    }
  }

  entry.count++
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  }
}

// Pre-configured rate limiters for different endpoints
export const RATE_LIMITS = {
  // Auth endpoints: 10 requests per minute
  auth: { maxRequests: 10, windowMs: 60 * 1000 },
  // Signup: 5 requests per 15 minutes
  signup: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  // Upload/analyze: 20 requests per minute (per user)
  analyze: { maxRequests: 20, windowMs: 60 * 1000 },
  // General API: 100 requests per minute
  api: { maxRequests: 100, windowMs: 60 * 1000 },
} as const

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    return xff.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return 'unknown'
}
