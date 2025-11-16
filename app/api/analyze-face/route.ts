import { NextRequest, NextResponse } from 'next/server'

/**
 * Temporary API endpoint that returns mock scores
 * This allows the MVP to work while we set up the proper backend
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

    console.log('📥 Received face analysis request')
    console.log('Face box:', faceBox)

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate a realistic score (temporarily using simple algorithm)
    // This will be replaced with actual AI model once backend is properly configured
    const baseScore = 5.0 + Math.random() * 3.5 // 5.0 to 8.5
    const score = Math.round(baseScore * 10) / 10

    console.log(`✅ Generated score: ${score}`)

    // Calculate breakdown (simple percentage)
    const percentage = Math.round((score / 10) * 100)

    return NextResponse.json({
      score,
      breakdown: {
        symmetry: percentage,
        proportions: percentage,
        features: percentage,
        overall: percentage,
      },
    })
  } catch (error: any) {
    console.error('❌ Error analyzing face:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze face' },
      { status: 500 }
    )
  }
}

// TODO: Implement full AI model inference
// The model requires tfjs-node which needs native compilation
// For now, using simple scoring to demonstrate MVP functionality
// Next step: Deploy to Railway/Render with Python backend for full AI inference

