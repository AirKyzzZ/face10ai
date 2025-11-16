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

// Cache for browser-side AI model (TensorFlow.js)
let beautyModel: tf.LayersModel | null = null
let modelsLoading = false
let tfOpLambdaRegistered = false

/**
 * Register TFOpLambda layer properly.
 * The model has TFOpLambda layers for preprocessing:
 * - tf.math.truediv: divides input by 127.5
 * - tf.math.subtract: subtracts 1.0
 * We implement these operations correctly in the custom layer.
 */
function registerTFOpLambdaLayer() {
  // Only register once to avoid conflicts
  if (tfOpLambdaRegistered) {
    return
  }

  try {
    // @ts-ignore - TFOpLambda is not in the TypeScript definitions
    class TFOpLambda extends tf.layers.Layer {
      private functionName: string
      private y: number | undefined

      constructor(config?: any) {
        super(config || {})
        this.functionName = config?.function || ''
        this.y = config?.y
      }

      call(inputs: tf.Tensor | tf.Tensor[], kwargs?: any): tf.Tensor | tf.Tensor[] {
        return tf.tidy(() => {
          // Get the actual tensor
          const input = Array.isArray(inputs) ? inputs[0] : inputs
          
          // Execute the appropriate TensorFlow operation
          if (this.functionName === 'math.truediv' || this.name.includes('truediv')) {
            // Division operation: input / y
            const divisor = this.y || 127.5
            return tf.div(input, divisor)
          } else if (this.functionName === 'math.subtract' || this.name.includes('subtract')) {
            // Subtraction operation: input - y
            const subtrahend = this.y || 1.0
            return tf.sub(input, subtrahend)
          }
          
          // Default: pass through
          return input
        })
      }

      static get className() {
        return 'TFOpLambda'
      }

      getConfig(): any {
        const config = super.getConfig()
        return {
          ...config,
          function: this.functionName,
          y: this.y
        }
      }

      computeOutputShape(inputShape: tf.Shape | tf.Shape[]): tf.Shape | tf.Shape[] {
        return inputShape
      }
    }

    // Register the custom layer
    tf.serialization.registerClass(TFOpLambda)
    tfOpLambdaRegistered = true
    console.log('✅ TFOpLambda layer registered successfully')
  } catch (error) {
    console.warn('Failed to register TFOpLambda layer:', error)
  }
}

/**
 * Load AI beauty prediction models (browser-side TensorFlow.js).
 *
 * This function is safe to call multiple times; it will cache models in memory
 * and will simply not enable scoring if models are missing.
 */
export async function loadBeautyModels(): Promise<void> {
  // Only run in the browser
  if (typeof window === 'undefined') return

  if (beautyModel || modelsLoading) {
    return
  }

  modelsLoading = true

  try {
    // Register TFOpLambda layer before loading the model
    registerTFOpLambdaLayer()

    console.log('Loading beauty model from /models/model.json...')
    
    // Try to load single neutral model
    beautyModel = await tf
      .loadLayersModel('/models/model.json')
      .catch((error) => {
        console.error(
          'Failed to load beauty model from /models/model.json',
          error
        )
        return null
      })

    if (beautyModel) {
      console.log('✅ Browser AI beauty model loaded successfully!')
      console.log('Model summary:', {
        inputs: beautyModel.inputs.map(i => ({ name: i.name, shape: i.shape })),
        outputs: beautyModel.outputs.map(o => ({ name: o.name, shape: o.shape }))
      })
    } else {
      // Model doesn't exist yet or failed to load - AI scoring will be disabled
      console.log(
        'ℹ️ Browser AI beauty model not available. Face scoring via AI is disabled until the model is available and loads correctly.'
      )
    }
  } catch (error) {
    // Disable AI scoring if something goes wrong and log the underlying error
    beautyModel = null
    console.error('Failed to load browser AI models. Face scoring via AI is disabled.', error)
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
  
  // Convert to float32 - the model's TFOpLambda layers will handle the normalization
  // (they will divide by 127.5 and subtract 1.0 to get [-1, 1] range)
  const floatTensor = tensor.toFloat()
  
  // Clean up original tensor
  tensor.dispose()
  
  return floatTensor as tf.Tensor3D
}

/**
 * Predict beauty score using browser-side AI model (TensorFlow.js).
 */
async function predictBeautyWithAI(
  faceImage: tf.Tensor3D
): Promise<number> {
  if (!beautyModel) {
    throw new Error('Beauty model not loaded')
  }
  
  // Add batch dimension
  const input = faceImage.expandDims(0)
  
  try {
    // Run inference
    const prediction = beautyModel.predict(input) as tf.Tensor
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

    // Ensure AI model is loaded (lazy-load on first use)
    if (!beautyModel) {
      await loadBeautyModels()

      if (!beautyModel) {
        throw new Error(
          'Le modèle IA de notation de beauté n\'est pas chargé. Veuillez réessayer plus tard.'
        )
      }
    }

    // Always use the trained AI model for scoring
    const faceImage = await preprocessFaceForModel(imageElement, detection)
    const aiScore = await predictBeautyWithAI(faceImage)

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
 * Load all required models (face detection + AI beauty models)
 * Call this once on app initialization
 */
export async function loadFaceApiModels(modelsPath = '/models'): Promise<void> {
  console.log('Loading face detection models...')
  
  try {
    // Load face-api.js models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
    ])

    console.log('Face detection models loaded!')
  } catch (error) {
    console.error('Failed to load face detection models:', error)
    throw error
  }
  
  // Load AI beauty models (non-blocking - allow face detection to work even if this fails)
  try {
    await loadBeautyModels()
  } catch (error) {
    console.warn('Failed to load beauty models, but face detection will still work:', error)
    // Don't throw - allow the app to continue without beauty scoring
  }
}
