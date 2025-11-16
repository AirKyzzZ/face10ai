// Client-side only - no TensorFlow imports to avoid environment conflicts
import * as faceapi from 'face-api.js'

export interface FaceAnalysis {
  symmetry: number
  proportions: number
  features: number
  overall: number
}

export interface RatingResult {
  score: number
  breakdown: FaceAnalysis
}

// Track if face detection models are loaded
let faceDetectionLoaded = false

/**
 * Load face detection models (client-side only)
 */
export async function loadFaceApiModels(modelsPath = '/models'): Promise<void> {
  // Only run in browser
  if (typeof window === 'undefined') return
  
  if (faceDetectionLoaded) return
  
  console.log('Loading face detection models...')
  
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
    ])
    
    faceDetectionLoaded = true
    console.log('✅ Face detection models loaded!')
  } catch (error) {
    console.error('Failed to load face detection models:', error)
    throw error
  }
}

/**
 * Convert image to base64 for backend transmission
 */
async function imageToBase64(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  // Set canvas to image size
  canvas.width = imageElement.width
  canvas.height = imageElement.height
  
  // Draw image
  ctx.drawImage(imageElement, 0, 0)
  
  // Convert to base64
  return canvas.toDataURL('image/jpeg', 0.95)
}

/**
 * Analyze face using backend API
 */
export async function analyzeFace(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  imageHash: string
): Promise<RatingResult> {
  try {
    // Detect face with landmarks using face-api.js
    const detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()

    if (!detection) {
      throw new Error('Aucun visage détecté dans l\'image')
    }

    console.log('✅ Face detected, preparing image...')

    // Convert entire image to base64 (backend will handle cropping)
    const imageBase64 = await imageToBase64(imageElement)
    
    // Get face box coordinates
    const box = detection.detection.box

    console.log('Sending to backend API for scoring...')

    // Send to backend API for beauty scoring
    const response = await fetch('/api/analyze-face', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
        faceBox: {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to analyze face')
    }

    const result = await response.json()
    console.log('✅ Backend analysis complete:', result)

    return result
  } catch (error) {
    console.error('Error analyzing face:', error)
    throw error
  }
}

