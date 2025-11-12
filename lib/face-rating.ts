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
  
  // Calculate face center line (vertical axis of symmetry)
  // Using nose bridge points and chin for the midline
  const noseBridge = points[27] // Top of nose bridge
  const noseTip = points[33] // Nose tip
  const chin = points[8] // Chin center
  const faceCenterX = (noseBridge.x + noseTip.x + chin.x) / 3
  
  // Get face width for normalization
  const faceWidth = Math.abs(points[16].x - points[0].x)
  
  // Define symmetric point pairs with their indices
  // [left_index, right_index, weight] - weight reflects importance
  const symmetricPairs = [
    // Jaw contour (8 pairs)
    [0, 16, 1.0],   // Jaw endpoints
    [1, 15, 1.0],
    [2, 14, 1.0],
    [3, 13, 1.0],
    [4, 12, 1.0],
    [5, 11, 1.0],
    [6, 10, 1.0],
    [7, 9, 1.0],
    
    // Eyebrows (5 pairs each)
    [17, 26, 1.2],  // Eyebrow outer points (more visible)
    [18, 25, 1.0],
    [19, 24, 1.0],
    [20, 23, 1.0],
    [21, 22, 1.2],  // Eyebrow inner points (more visible)
    
    // Eyes (6 pairs each - very important for symmetry perception)
    [36, 45, 1.5],  // Outer eye corners
    [37, 44, 1.3],
    [38, 43, 1.3],
    [39, 42, 1.5],  // Inner eye corners
    [40, 47, 1.3],
    [41, 46, 1.3],
    
    // Nose base (symmetry around center)
    [31, 35, 1.4],  // Nose wings
    [32, 34, 1.2],
    
    // Mouth (important for overall symmetry)
    [48, 54, 1.4],  // Mouth corners
    [49, 53, 1.2],
    [50, 52, 1.2],
    [59, 55, 1.1],
    [58, 56, 1.1],
  ]
  
  let totalWeightedAsymmetry = 0
  let totalWeight = 0
  
  for (const [leftIdx, rightIdx, weight] of symmetricPairs) {
    const leftPoint = points[leftIdx]
    const rightPoint = points[rightIdx]
    
    // Calculate distance from each point to the center line
    const leftDistFromCenter = Math.abs(leftPoint.x - faceCenterX)
    const rightDistFromCenter = Math.abs(rightPoint.x - faceCenterX)
    
    // Calculate vertical alignment (Y-coordinate difference)
    const verticalDiff = Math.abs(leftPoint.y - rightPoint.y)
    
    // Horizontal symmetry: how much the distances differ
    const horizontalAsymmetry = Math.abs(leftDistFromCenter - rightDistFromCenter)
    
    // Normalize by face width and combine horizontal and vertical asymmetry
    const normalizedAsymmetry = (horizontalAsymmetry + verticalDiff * 0.5) / faceWidth
    
    // Weight the asymmetry
    totalWeightedAsymmetry += normalizedAsymmetry * weight
    totalWeight += weight
  }
  
  // Calculate average weighted asymmetry
  const avgAsymmetry = totalWeightedAsymmetry / totalWeight
  
  // Convert to a score (0-100)
  // Perfect symmetry (avgAsymmetry = 0) -> 100
  // Higher asymmetry -> lower score
  // Using exponential decay for more realistic scoring
  // More forgiving formula - most faces should score 70-95
  const rawScore = 100 * Math.exp(-avgAsymmetry * 15)
  
  // Add base boost to be more generous
  const symmetryScore = rawScore * 0.75 + 25
  
  // Clamp between reasonable bounds (55-100)
  return Math.max(55, Math.min(100, symmetryScore))
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
  // Using a much more forgiving calculation
  const faceRatioDiff = Math.abs(faceRatio - goldenRatio) / goldenRatio
  const verticalRatioDiff = Math.abs((eyeToNose / noseToMouth) - goldenRatio) / goldenRatio

  // More generous scoring - using exponential decay instead of linear
  // Perfect match = 100, 20% deviation = ~82, 40% deviation = ~67
  const faceRatioScore = 100 * Math.exp(-faceRatioDiff * 2)
  const verticalRatioScore = 100 * Math.exp(-verticalRatioDiff * 2)
  
  // Average the scores and add a base boost
  const avgScore = (faceRatioScore + verticalRatioScore) / 2
  
  // Add base score to be more generous (everyone gets at least 60)
  const proportionScore = avgScore * 0.7 + 30
  
  return Math.max(60, Math.min(100, proportionScore))
}

export function calculateFeatureQuality(
  detection: faceapi.FaceDetection,
  landmarks: faceapi.FaceLandmarks68
): number {
  // Use detection confidence as a base (boosted)
  const confidence = Math.min(100, detection.score * 100 + 10)

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
  const eyeSpacingDiff = Math.abs(eyeSpacingRatio - 0.35)
  
  // More forgiving eye spacing score using exponential
  const eyeSpacingScore = 100 * Math.exp(-eyeSpacingDiff * 8)
  
  // Average with a boost
  const featureScore = (confidence * 0.6 + eyeSpacingScore * 0.4) * 0.85 + 15
  
  return Math.max(65, Math.min(100, featureScore))
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
    
    // Calculate weighted average (0-100 scale)
    const weightedAverage = (
      symmetryScore * 0.35 +
      proportionsScore * 0.35 +
      featuresScore * 0.30
    )

    // Convert to 10-point scale with generous boost
    // Formula: (score - 50) * 0.12 + 6.5
    // This maps: 60 -> 6.7, 70 -> 7.9, 80 -> 9.1, 90 -> 10.3 (clamped to 10)
    let baseScore = (weightedAverage - 50) * 0.12 + 6.5
    
    // Add positive variation based on hash (0 to +0.8)
    const hashAdjustment = hashVariation * 0.8
    
    // Small gender variation (both slightly positive)
    const genderAdjustment = gender === 'homme' ? 0.15 : 0.1
    
    // Final score with all adjustments
    let finalScore = baseScore + hashAdjustment + genderAdjustment
    
    // Clamp between 5.5 and 10.0 (supermodels should hit 9-10)
    finalScore = Math.max(5.5, Math.min(10.0, finalScore))

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
