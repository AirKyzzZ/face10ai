// BACKUP: Original geometric-based face rating system
// This file is kept for reference and fallback purposes

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
  
  const noseBridge = points[27]
  const noseTip = points[33]
  const chin = points[8]
  const faceCenterX = (noseBridge.x + noseTip.x + chin.x) / 3
  const faceWidth = Math.abs(points[16].x - points[0].x)
  
  const symmetricPairs = [
    [0, 16, 1.0], [1, 15, 1.0], [2, 14, 1.0], [3, 13, 1.0],
    [4, 12, 1.0], [5, 11, 1.0], [6, 10, 1.0], [7, 9, 1.0],
    [17, 26, 1.2], [18, 25, 1.0], [19, 24, 1.0], [20, 23, 1.0], [21, 22, 1.2],
    [36, 45, 1.5], [37, 44, 1.3], [38, 43, 1.3], [39, 42, 1.5], [40, 47, 1.3], [41, 46, 1.3],
    [31, 35, 1.4], [32, 34, 1.2],
    [48, 54, 1.4], [49, 53, 1.2], [50, 52, 1.2], [59, 55, 1.1], [58, 56, 1.1],
  ]
  
  let totalWeightedAsymmetry = 0
  let totalWeight = 0
  
  for (const [leftIdx, rightIdx, weight] of symmetricPairs) {
    const leftPoint = points[leftIdx]
    const rightPoint = points[rightIdx]
    
    const leftDistFromCenter = Math.abs(leftPoint.x - faceCenterX)
    const rightDistFromCenter = Math.abs(rightPoint.x - faceCenterX)
    const verticalDiff = Math.abs(leftPoint.y - rightPoint.y)
    const horizontalAsymmetry = Math.abs(leftDistFromCenter - rightDistFromCenter)
    const normalizedAsymmetry = (horizontalAsymmetry + verticalDiff * 0.5) / faceWidth
    
    totalWeightedAsymmetry += normalizedAsymmetry * weight
    totalWeight += weight
  }
  
  const avgAsymmetry = totalWeightedAsymmetry / totalWeight
  const rawScore = 100 * Math.exp(-avgAsymmetry * 15)
  const symmetryScore = rawScore * 0.75 + 25
  
  return Math.max(55, Math.min(100, symmetryScore))
}

export function calculateGoldenRatio(landmarks: faceapi.FaceLandmarks68): number {
  const points = landmarks.positions
  const goldenRatio = 1.618

  const faceWidth = Math.abs(points[16].x - points[0].x)
  const faceHeight = Math.abs(points[8].y - points[27].y)
  const faceRatio = faceWidth / faceHeight

  const leftEye = points[36]
  const rightEye = points[45]
  const nose = points[33]
  const mouth = points[51]

  const eyeDistance = Math.abs(rightEye.x - leftEye.x)
  const eyeToNose = Math.abs(nose.y - ((leftEye.y + rightEye.y) / 2))
  const noseToMouth = Math.abs(mouth.y - nose.y)

  const faceRatioDiff = Math.abs(faceRatio - goldenRatio) / goldenRatio
  const verticalRatioDiff = Math.abs((eyeToNose / noseToMouth) - goldenRatio) / goldenRatio

  const faceRatioScore = 100 * Math.exp(-faceRatioDiff * 2)
  const verticalRatioScore = 100 * Math.exp(-verticalRatioDiff * 2)
  
  const avgScore = (faceRatioScore + verticalRatioScore) / 2
  const proportionScore = avgScore * 0.7 + 30
  
  return Math.max(60, Math.min(100, proportionScore))
}

export function calculateFeatureQuality(
  detection: faceapi.FaceDetection,
  landmarks: faceapi.FaceLandmarks68
): number {
  const confidence = Math.min(100, detection.score * 100 + 10)

  const points = landmarks.positions
  const leftEye = points[36]
  const rightEye = points[45]

  const eyeDistance = Math.abs(rightEye.x - leftEye.x)
  const faceWidth = Math.abs(points[16].x - points[0].x)
  
  const eyeSpacingRatio = eyeDistance / faceWidth
  const eyeSpacingDiff = Math.abs(eyeSpacingRatio - 0.35)
  const eyeSpacingScore = 100 * Math.exp(-eyeSpacingDiff * 8)
  
  const featureScore = (confidence * 0.6 + eyeSpacingScore * 0.4) * 0.85 + 15
  
  return Math.max(65, Math.min(100, featureScore))
}

export async function analyzeFace(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  gender: string,
  imageHash: string
): Promise<RatingResult> {
  try {
    const detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()

    if (!detection) {
      throw new Error('Aucun visage détecté dans l\'image')
    }

    const symmetryScore = calculateFacialSymmetry(detection.landmarks)
    const proportionsScore = calculateGoldenRatio(detection.landmarks)
    const featuresScore = calculateFeatureQuality(detection.detection, detection.landmarks)

    const hashSeed = imageHash.substring(0, 16)
    const hashVariation = seededRandom(hashSeed)
    
    const weightedAverage = (
      symmetryScore * 0.35 +
      proportionsScore * 0.35 +
      featuresScore * 0.30
    )

    let baseScore = (weightedAverage - 50) * 0.12 + 6.5
    const hashAdjustment = hashVariation * 0.8
    const genderAdjustment = gender === 'homme' ? 0.15 : 0.1
    
    let finalScore = baseScore + hashAdjustment + genderAdjustment
    finalScore = Math.max(5.5, Math.min(10.0, finalScore))

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

export async function loadFaceApiModels(modelsPath = '/models'): Promise<void> {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
  ])
}

