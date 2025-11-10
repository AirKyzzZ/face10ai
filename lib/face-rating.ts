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

// Seeded random number generator for consistency
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  const x = Math.sin(Math.abs(hash)) * 10000
  return x - Math.floor(x)
}

export function calculateFacialSymmetry(landmarks: faceapi.FaceLandmarks68): number {
  const points = landmarks.positions

  // Calculate symmetry by comparing left and right sides
  const leftJaw = points.slice(0, 8)
  const rightJaw = points.slice(9, 17).reverse()
  
  let symmetryScore = 0
  const pairsToCompare = Math.min(leftJaw.length, rightJaw.length)
  
  for (let i = 0; i < pairsToCompare; i++) {
    const leftPoint = leftJaw[i]
    const rightPoint = rightJaw[i]
    const distance = Math.abs(leftPoint.x - rightPoint.x)
    symmetryScore += 1 / (1 + distance / 10)
  }
  
  return (symmetryScore / pairsToCompare) * 100
}

export function calculateGoldenRatio(landmarks: faceapi.FaceLandmarks68): number {
  const points = landmarks.positions
  const goldenRatio = 1.618

  // Face width to height ratio
  const faceWidth = Math.abs(points[16].x - points[0].x)
  const faceHeight = Math.abs(points[8].y - points[27].y)
  const faceRatio = faceWidth / faceHeight

  // Eye to mouth distance ratios
  const leftEye = points[36]
  const rightEye = points[45]
  const nose = points[33]
  const mouth = points[51]

  const eyeDistance = Math.abs(rightEye.x - leftEye.x)
  const eyeToNose = Math.abs(nose.y - ((leftEye.y + rightEye.y) / 2))
  const noseToMouth = Math.abs(mouth.y - nose.y)

  // Calculate how close ratios are to golden ratio
  const faceRatioDiff = Math.abs(faceRatio - goldenRatio) / goldenRatio
  const verticalRatioDiff = Math.abs((eyeToNose / noseToMouth) - goldenRatio) / goldenRatio

  const ratioScore = 100 - ((faceRatioDiff + verticalRatioDiff) / 2) * 100
  return Math.max(0, Math.min(100, ratioScore))
}

export function calculateFeatureQuality(
  detection: faceapi.FaceDetection,
  landmarks: faceapi.FaceLandmarks68
): number {
  // Use detection confidence as a base
  const confidence = detection.score * 100

  // Check feature spacing
  const points = landmarks.positions
  const leftEye = points[36]
  const rightEye = points[45]
  const nose = points[33]
  const mouth = points[51]

  const eyeDistance = Math.abs(rightEye.x - leftEye.x)
  const faceWidth = Math.abs(points[16].x - points[0].x)
  
  // Ideal eye spacing is roughly 0.3-0.4 of face width
  const eyeSpacingRatio = eyeDistance / faceWidth
  const eyeSpacingScore = 100 - Math.abs(eyeSpacingRatio - 0.35) * 200

  return (confidence + eyeSpacingScore) / 2
}

export async function analyzeFace(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  gender: string,
  imageHash: string
): Promise<RatingResult> {
  try {
    // Detect face with landmarks using TinyFaceDetector
    const detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()

    if (!detection) {
      throw new Error('Aucun visage détecté dans l\'image')
    }

    // Calculate metrics
    const symmetryScore = calculateFacialSymmetry(detection.landmarks)
    const proportionsScore = calculateGoldenRatio(detection.landmarks)
    const featuresScore = calculateFeatureQuality(detection.detection, detection.landmarks)

    // Add deterministic variation based on image hash
    const hashSeed = imageHash.substring(0, 16)
    const hashVariation = seededRandom(hashSeed)
    
    // Gender adjustment (subtle difference)
    const genderAdjustment = gender === 'homme' ? 0.02 : -0.02

    // Calculate overall score with weights
    const baseScore = (
      symmetryScore * 0.35 +
      proportionsScore * 0.35 +
      featuresScore * 0.30
    ) / 10

    // Add consistent variation based on hash (-0.5 to +0.5)
    const hashAdjustment = (hashVariation - 0.5)
    
    // Final score between 1 and 10
    const finalScore = Math.max(
      1,
      Math.min(10, baseScore + hashAdjustment + genderAdjustment)
    )

    // Round to 1 decimal place
    const score = Math.round(finalScore * 10) / 10

    return {
      score,
      breakdown: {
        symmetry: Math.round(symmetryScore),
        proportions: Math.round(proportionsScore),
        features: Math.round(featuresScore),
        overall: Math.round(score * 10),
      },
    }
  } catch (error) {
    console.error('Error analyzing face:', error)
    throw error
  }
}

// Load models (call this once on app initialization)
export async function loadFaceApiModels(modelsPath = '/models'): Promise<void> {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
  ])
}

