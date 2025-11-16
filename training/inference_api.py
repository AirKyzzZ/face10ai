"""
FastAPI service for AttractiveNet beauty score prediction.

This service provides a REST API endpoint to predict beauty scores
using the pre-trained AttractiveNet model.

Usage:
    python inference_api.py
    
    Or with uvicorn:
    uvicorn inference_api:app --host 0.0.0.0 --port 8000 --reload
"""

import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Add training directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.inference import predict_from_base64, load_attractivenet_model


# Initialize FastAPI app
app = FastAPI(
    title="AttractiveNet Inference API",
    description="API for predicting facial beauty scores using AttractiveNet",
    version="1.0.0"
)

# Configure CORS to allow requests from Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response models
class PredictionRequest(BaseModel):
    """Request model for beauty score prediction."""
    image: str  # Base64-encoded image (with or without data URL prefix)
    model_path: Optional[str] = "models/attractiveNet_mnv2.h5"  # Optional custom model path


class PredictionResponse(BaseModel):
    """Response model for beauty score prediction."""
    score: float  # Beauty score (typically 1-5 range)
    success: bool
    message: Optional[str] = None


# Health check endpoint
@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "AttractiveNet Inference API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    try:
        # Try to load model to verify it's available
        load_attractivenet_model()
        return {
            "status": "healthy",
            "model_loaded": True
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "model_loaded": False,
            "error": str(e)
        }


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict beauty score for a face image.
    
    Args:
        request: PredictionRequest containing base64-encoded image
    
    Returns:
        PredictionResponse with beauty score (1-5 range)
    
    Raises:
        HTTPException: If prediction fails
    """
    try:
        # Predict beauty score
        score = predict_from_base64(request.image, request.model_path)
        
        return PredictionResponse(
            score=score,
            success=True,
            message="Prediction successful"
        )
    
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Model file not found: {str(e)}"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image data: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    print(f"Starting AttractiveNet Inference API on {host}:{port}")
    print(f"Model path: training/models/attractiveNet_mnv2.h5")
    
    uvicorn.run(
        "inference_api:app",
        host=host,
        port=port,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )

