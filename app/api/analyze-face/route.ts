import { NextRequest, NextResponse } from 'next/server'

/**
 * API endpoint that forwards face analysis to Python AI backend
 * Uses real trained model for accurate beauty scoring
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { image, faceBox } = body
    
    if (!image || !faceBox) {
      return NextResponse.json(
        { error: 'Missing image or face box data' },
        { status: 400 }
      )
    }

    console.log('📥 Received face analysis request, forwarding to Python AI...')

    // Get Python backend URL from environment
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'

    try {
      // Forward request to Python FastAPI backend
      const response = await fetch(`${pythonApiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.INTERNAL_API_KEY && {
            'X-API-Key': process.env.INTERNAL_API_KEY,
          }),
        },
        body: JSON.stringify({
          image,
          faceBox,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(error.detail || 'Python backend error')
      }

      const result = await response.json()
      console.log(`✅ Real AI score received: ${result.score}/10`)

      return NextResponse.json(result)
      
    } catch (fetchError: any) {
      console.error('❌ Python backend unavailable:', fetchError.message)
      
      // Fallback: Return mock score if Python backend is down
      // This allows the app to work even if backend isn't running
      console.log('⚠️  Using fallback scoring (Python backend not available)')
      
      const fallbackScore = 7.0 + Math.random() * 1.5 // 7.0-8.5
      const score = Math.round(fallbackScore * 10) / 10
      const percentage = Math.round((score / 10) * 100)

      return NextResponse.json({
        score,
        breakdown: {
          symmetry: percentage,
          proportions: percentage,
          features: percentage,
          overall: percentage,
        },
        fallback: true, // Indicate this is not real AI
      })
    }
  } catch (error: any) {
    console.error('❌ Error analyzing face:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze face' },
      { status: 500 }
    )
  }
}

