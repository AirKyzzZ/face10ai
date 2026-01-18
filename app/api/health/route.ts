import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const checks: Record<string, string> = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'unknown',
    pythonBackend: 'unknown',
  }

  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`
    checks.database = 'connected'
  } catch {
    checks.database = 'disconnected'
    checks.status = 'degraded'
  }

  try {
    // Check Python AI backend
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'
    const response = await fetch(`${pythonApiUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    checks.pythonBackend = response.ok ? 'connected' : 'unhealthy'
  } catch {
    checks.pythonBackend = 'disconnected'
    // Python backend being down is acceptable (fallback exists)
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}
