"""
Inference utilities for AttractiveNet model.

This module provides functions to load the pre-trained AttractiveNet model
and perform beauty score predictions on face images.
"""

import os
import cv2
import numpy as np
from typing import Tuple, Optional
from tensorflow import keras
from tensorflow.keras.models import load_model


# Global model cache
_model: Optional[keras.Model] = None


def load_attractivenet_model(model_path: str = 'models/attractiveNet_mnv2.h5') -> keras.Model:
    """
    Load the AttractiveNet model from file.
    
    The model is cached globally to avoid reloading on each request.
    
    Args:
        model_path: Path to the .h5 model file (relative to training directory)
    
    Returns:
        Loaded Keras model
    
    Raises:
        FileNotFoundError: If model file doesn't exist
        Exception: If model loading fails
    """
    global _model
    
    if _model is not None:
        return _model
    
    # Get absolute path relative to training directory
    training_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    full_model_path = os.path.join(training_dir, model_path)
    
    if not os.path.exists(full_model_path):
        raise FileNotFoundError(
            f"Model file not found at {full_model_path}. "
            f"Please ensure the model is downloaded to training/models/attractiveNet_mnv2.h5"
        )
    
    try:
        print(f"Loading AttractiveNet model from {full_model_path}...")
        _model = load_model(full_model_path)
        print("✅ AttractiveNet model loaded successfully!")
        return _model
    except Exception as e:
        raise Exception(f"Failed to load model: {str(e)}")


def preprocess_image_for_attractivenet(
    image: np.ndarray,
    target_size: Tuple[int, int] = (350, 350)
) -> np.ndarray:
    """
    Preprocess image for AttractiveNet model input.
    
    According to the AttractiveNet README:
    - Convert BGR to RGB
    - Resize to target_size (350x350)
    - Normalize to [0, 1] by dividing by 255
    
    Args:
        image: Input image (BGR format from cv2 or RGB numpy array)
        target_size: Target size for the image (width, height)
    
    Returns:
        Preprocessed image as numpy array with shape (height, width, 3)
        Values normalized to [0, 1] range
    """
    # If image is already RGB (3 channels), use as is
    # Otherwise assume BGR and convert
    if len(image.shape) == 3 and image.shape[2] == 3:
        # Check if it's BGR (common case with cv2) or RGB
        # We'll convert BGR to RGB to be safe
        # Note: If image comes from base64/PIL, it's likely already RGB
        # But cv2.imdecode returns BGR, so we convert
        if image.dtype == np.uint8:
            # Assume BGR if uint8 (from cv2), convert to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Resize to target size
    image = cv2.resize(image, target_size)
    
    # Normalize to [0, 1]
    image = image.astype(np.float32) / 255.0
    
    return image


def predict_beauty_score(
    image: np.ndarray,
    model_path: str = 'models/attractiveNet_mnv2.h5'
) -> float:
    """
    Predict beauty score for a face image using AttractiveNet.
    
    Args:
        image: Input image (BGR format from cv2 or RGB numpy array)
        model_path: Path to model file (relative to training directory)
    
    Returns:
        Beauty score (typically in range 1-5 from SCUT-FBP5500 dataset)
    
    Raises:
        Exception: If model loading or prediction fails
    """
    # Load model (cached)
    model = load_attractivenet_model(model_path)
    
    # Preprocess image
    preprocessed = preprocess_image_for_attractivenet(image)
    
    # Add batch dimension: (1, height, width, channels)
    batch_input = np.expand_dims(preprocessed, axis=0)
    
    # Predict
    prediction = model.predict(batch_input, verbose=0)
    
    # Extract score (model outputs a single value)
    score = float(prediction[0][0])
    
    return score


def predict_from_base64(
    base64_image: str,
    model_path: str = 'models/attractiveNet_mnv2.h5'
) -> float:
    """
    Predict beauty score from a base64-encoded image.
    
    Args:
        base64_image: Base64-encoded image string (with or without data URL prefix)
        model_path: Path to model file (relative to training directory)
    
    Returns:
        Beauty score (typically in range 1-5)
    
    Raises:
        Exception: If image decoding or prediction fails
    """
    import base64
    
    # Remove data URL prefix if present
    if ',' in base64_image:
        base64_image = base64_image.split(',')[1]
    
    # Decode base64
    image_bytes = base64.b64decode(base64_image)
    
    # Convert to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    
    # Decode image (cv2.imdecode handles JPEG, PNG, etc.)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        raise ValueError("Failed to decode image from base64")
    
    # Predict
    return predict_beauty_score(image, model_path)

