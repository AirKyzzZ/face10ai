#!/bin/bash
# Training Script Runner with No Sleep
# This prevents your Mac from sleeping during training

set -e  # Exit on error

echo "=========================================="
echo "Beauty Recognition Model Training"
echo "WITH NO SLEEP MODE ENABLED"
echo "=========================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Error: Virtual environment not found!"
    echo "Please create it first:"
    echo "  python3.11 -m venv venv"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
echo "Checking dependencies..."
if ! python -c "import numpy" 2>/dev/null; then
    echo "Dependencies not installed. Installing..."
    echo ""
    
    pip install --upgrade pip
    
    if [ -f "requirements-simple.txt" ]; then
        echo "Installing from requirements-simple.txt..."
        pip install -r requirements-simple.txt
    else
        echo "Installing from requirements.txt..."
        pip install -r requirements.txt
    fi
    
    echo ""
    echo "Dependencies installed!"
else
    echo "Dependencies already installed."
fi

echo ""
echo "Python version: $(python --version)"
echo "Python path: $(which python)"
echo ""

# Check TensorFlow
echo "Checking TensorFlow..."
python -c "import tensorflow as tf; print(f'TensorFlow {tf.__version__}')" || {
    echo "Error: TensorFlow not found!"
    echo "Please install dependencies first."
    exit 1
}

echo ""
echo "=========================================="
echo "Preventing Mac from sleeping..."
echo "=========================================="
echo ""
echo "⚠️  IMPORTANT:"
echo "   - Mac will NOT sleep while training is running"
echo "   - Screen will stay on"
echo "   - Press Ctrl+C to stop training and allow sleep"
echo ""
echo "Starting training with caffeinate (prevents sleep)..."
echo ""

# Use caffeinate to prevent sleep during training
# -d: prevent display from sleeping
# -i: prevent system from idle sleeping
# -m: prevent disk from sleeping
# -s: prevent system from sleeping (only when plugged in)
# -u: simulate user activity to keep screen awake

caffeinate -dims python train.py

# After training completes, caffeinate will exit and normal sleep behavior resumes
echo ""
echo "=========================================="
echo "Training complete!"
echo "=========================================="
echo "Mac will resume normal sleep behavior."

