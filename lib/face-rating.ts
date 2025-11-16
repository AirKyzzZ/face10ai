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

// Cache for browser-side AI models (TensorFlow.js)
let maleModel: tf.LayersModel | null = null
let femaleModel: tf.LayersModel | null = null
let modelsLoading = false

/**
 * Load AI beauty prediction models (browser-side TensorFlow.js).
 *
 * This function is safe to call multiple times; it will cache models in memory
 * and will simply not enable scoring if models are missing.
 */
export async function loadBeautyModels(): Promise<void> {
  // Only run in the browser
  if (typeof window === 'undefined') return

  if ((maleModel && femaleModel) || modelsLoading) {
    return
  }

  modelsLoading = true

  try {
    // Try to load models - will gracefully fail if they don't exist
    const modelPromises = [
      tf.loadLayersModel('/models/beauty_model_male/model.json').catch(() => null),
      tf.loadLayersModel('/models/beauty_model_female/model.json').catch(() => null),
    ]

    const [maleModelLoaded, femaleModelLoaded] = await Promise.all(modelPromises)

    if (maleModelLoaded && femaleModelLoaded) {
      maleModel = maleModelLoaded
      femaleModel = femaleModelLoaded
      console.log('✅ Browser AI beauty models loaded successfully!')
    } else {
      // Models don't exist yet - this is normal until training is complete
      console.log(
        'ℹ️ Browser AI beauty models not found. Face scoring via AI will be disabled until models are trained.'
      )
      maleModel = null
      femaleModel = null
    }
  } catch (error) {
    // Silently disable AI scoring if something goes wrong
    maleModel = null
    femaleModel = null
    console.warn('Failed to load browser AI models. Face scoring via AI is disabled.', error)
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
 * Predict beauty score using browser-side AI model (TensorFlow.js).
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

    if (!maleModel || !femaleModel) {
      throw new Error(
        'Les modèles IA de notation de beauté ne sont pas chargés. Veuillez réessayer plus tard.'
      )
    }

    // Always use the trained AI models for scoring
    const faceImage = await preprocessFaceForModel(imageElement, detection)
    const aiScore = await predictBeautyWithAI(faceImage, gender)

    // Clean up tensor
    faceImage.dispose()

    let finalScore = aiScore

    // Ensure score is in valid range
    finalScore = Math.max(1.0, Math.min(10.0, finalScore))

    // Round to 1 decimal place
    const score = Math.round(finalScore * 10) / 10

    // Derive simple percentage-based breakdown from the AI score only
    const breakdownPercent = Math.round((score / 10) * 100)

    return {
      score,
      breakdown: {
        symmetry: breakdownPercent,
        proportions: breakdownPercent,
        features: breakdownPercent,
        overall: breakdownPercent,
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
