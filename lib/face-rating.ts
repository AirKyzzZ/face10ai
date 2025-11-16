import * as faceapi from 'face-api.js'
import * as tf from '@tensorflow/tfjs'

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

// Cache for loaded AI models
let maleModel: tf.LayersModel | null = null
let femaleModel: tf.LayersModel | null = null
let modelsLoading = false

// AttractiveNet API configuration
const ATTRACTIVENET_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000'
const USE_ATTRACTIVENET = process.env.NEXT_PUBLIC_USE_ATTRACTIVENET !== 'false' // Default to true

/**
 * Load AI beauty prediction models
 */
export async function loadBeautyModels(): Promise<void> {
  if ((maleModel && femaleModel) || modelsLoading) {
    return
  }

  modelsLoading = true

  try {
    // Try to load models - will gracefully fail if they don't exist
    // This is expected until models are trained and converted
    const modelPromises = [
      tf.loadLayersModel('/models/beauty_model_male/model.json').catch(() => null),
      tf.loadLayersModel('/models/beauty_model_female/model.json').catch(() => null)
    ]
    
    const [maleModelLoaded, femaleModelLoaded] = await Promise.all(modelPromises)

    if (maleModelLoaded && femaleModelLoaded) {
      maleModel = maleModelLoaded
      femaleModel = femaleModelLoaded
      console.log('✅ AI beauty models loaded successfully!')
    } else {
      // Models don't exist yet - this is normal until training is complete
      console.log('ℹ️ AI beauty models not found. Using geometric analysis (expected until models are trained).')
      maleModel = null
      femaleModel = null
    }
  } catch (error) {
    // Silently fall back to geometric analysis
    // Models will be null, triggering fallback in analyzeFace
    maleModel = null
    femaleModel = null
  } finally {
    modelsLoading = false
  }
}

/**
 * Extract and preprocess face region for AI model input (TensorFlow.js)
 */
async function preprocessFaceForModel(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  detection: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>
): Promise<tf.Tensor3D> {
  // Get the bounding box of the face
  const box = detection.detection.box
  
  // Create a canvas to extract the face region
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  // Add padding around face (10%)
  const padding = 0.1
  const paddedWidth = box.width * (1 + 2 * padding)
  const paddedHeight = box.height * (1 + 2 * padding)
  const paddedX = Math.max(0, box.x - box.width * padding)
  const paddedY = Math.max(0, box.y - box.height * padding)
  
  // Set canvas size to model input size (224x224)
  canvas.width = 224
  canvas.height = 224
  
  // Draw the face region
  ctx.drawImage(
    imageElement,
    paddedX, paddedY, paddedWidth, paddedHeight,
    0, 0, 224, 224
  )
  
  // Convert canvas to tensor
  const tensor = tf.browser.fromPixels(canvas)
  
  // Normalize to [0, 1] range
  const normalized = tensor.toFloat().div(255.0)
  
  // Clean up
  tensor.dispose()
  
  return normalized as tf.Tensor3D
}

/**
 * Extract face region and convert to base64 for AttractiveNet API
 */
function extractFaceAsBase64(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  detection: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>,
  targetSize: { width: number; height: number } = { width: 350, height: 350 }
): string {
  const box = detection.detection.box
  
  // Create a canvas to extract the face region
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  // Add padding around face (10%)
  const padding = 0.1
  const paddedWidth = box.width * (1 + 2 * padding)
  const paddedHeight = box.height * (1 + 2 * padding)
  const paddedX = Math.max(0, box.x - box.width * padding)
  const paddedY = Math.max(0, box.y - box.height * padding)
  
  // Set canvas size to AttractiveNet input size (350x350)
  canvas.width = targetSize.width
  canvas.height = targetSize.height
  
  // Draw the face region
  ctx.drawImage(
    imageElement,
    paddedX, paddedY, paddedWidth, paddedHeight,
    0, 0, targetSize.width, targetSize.height
  )
  
  // Convert to base64
  return canvas.toDataURL('image/jpeg', 0.95)
}

/**
 * Predict beauty score using AttractiveNet API
 */
async function predictWithAttractiveNet(
  imageElement: HTMLImageElement | HTMLCanvasElement,
  detection: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>
): Promise<number> {
  try {
    // Extract face region as base64
    const base64Image = extractFaceAsBase64(imageElement, detection)
    
    // Call Python API
    const response = await fetch(`${ATTRACTIVENET_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API request failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Prediction failed')
    }
    
    // AttractiveNet returns score in 1-5 range (from SCUT-FBP5500)
    // Convert to 1-10 range: multiply by 2, then clamp to 1-10
    const score = data.score * 2
    return Math.max(1.0, Math.min(10.0, score))
  } catch (error) {
    console.warn('AttractiveNet API call failed:', error)
    throw error
  }
}

/**
 * Predict beauty score using AI model
 */
async function predictBeautyWithAI(
  faceImage: tf.Tensor3D,
  gender: string
): Promise<number> {
  const model = gender === 'homme' ? maleModel : femaleModel
  
  if (!model) {
    throw new Error('Beauty model not loaded')
  }
  
  // Add batch dimension
  const input = faceImage.expandDims(0)
  
  try {
    // Run inference
    const prediction = model.predict(input) as tf.Tensor
    const scoreArray = await prediction.data()
    const score = scoreArray[0]
    
    // Clean up tensors
    prediction.dispose()
    input.dispose()
    
    // Ensure score is in valid range (0-10)
    return Math.max(0, Math.min(10, score))
  } catch (error) {
    input.dispose()
    throw error
  }
}

// Seeded random number generator for consistency (used for fallback)
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

    let finalScore: number
    let usingAI = false

    // Priority 1: Try AttractiveNet API (if enabled)
    if (USE_ATTRACTIVENET && typeof window !== 'undefined') {
      try {
        const attractivenetScore = await predictWithAttractiveNet(imageElement, detection)
        finalScore = attractivenetScore
        usingAI = true
        console.log(`✅ AttractiveNet prediction: ${attractivenetScore.toFixed(2)}`)
      } catch (attractivenetError) {
        console.warn('AttractiveNet API failed, trying TensorFlow.js models:', attractivenetError)
        // Fall through to next option
      }
    }

    // Priority 2: Try TensorFlow.js models (if AttractiveNet failed or disabled)
    if (!usingAI && maleModel && femaleModel) {
      try {
        // Preprocess face for model input
        const faceImage = await preprocessFaceForModel(imageElement, detection)
        
        // Get AI prediction
        const aiScore = await predictBeautyWithAI(faceImage, gender)
        
        // Clean up tensor
        faceImage.dispose()
        
        finalScore = aiScore
        usingAI = true
        console.log(`✅ TensorFlow.js AI prediction: ${aiScore.toFixed(2)} for ${gender}`)
      } catch (aiError) {
        console.warn('TensorFlow.js AI prediction failed, falling back to geometric analysis:', aiError)
        finalScore = calculateGeometricScore(detection, gender, imageHash)
      }
    } else if (!usingAI) {
      // Priority 3: Fall back to geometric analysis
      // This is expected if models haven't been trained yet or APIs are unavailable
      finalScore = calculateGeometricScore(detection, gender, imageHash)
    }

    // Ensure score is in valid range
    finalScore = Math.max(1.0, Math.min(10.0, finalScore))

    // Round to 1 decimal place
    const score = Math.round(finalScore * 10) / 10

    // Calculate breakdown scores (for display purposes)
    const symmetryScore = calculateFacialSymmetry(detection.landmarks)
    const proportionsScore = calculateGoldenRatio(detection.landmarks)
    const featuresScore = calculateFeatureQuality(detection.detection, detection.landmarks)

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

/**
 * Fallback geometric calculation (backup method)
 */
function calculateGeometricScore(
  detection: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>,
  gender: string,
  imageHash: string
): number {
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

  return finalScore
}

/**
 * Load all required models (face detection + AI beauty models)
 * Call this once on app initialization
 */
export async function loadFaceApiModels(modelsPath = '/models'): Promise<void> {
  console.log('Loading face detection models...')
  
  // Load face-api.js models
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
  ])

  console.log('Face detection models loaded!')
  
  // Load AI beauty models
  await loadBeautyModels()
}
