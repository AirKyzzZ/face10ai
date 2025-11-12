#!/bin/bash
# Training Script Runner
# This script activates the virtual environment and runs training

set -e  # Exit on error

echo "=========================================="
echo "Beauty Recognition Model Training"
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
    
    # Upgrade pip first
    pip install --upgrade pip
    
    # Install dependencies
    if [ -f "requirements-macos-silicon.txt" ]; then
        echo "Installing from requirements-macos-silicon.txt..."
        pip install -r requirements-macos-silicon.txt
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
echo "Starting training..."
echo "=========================================="
echo ""

# Run training script
python train.py

echo ""
echo "=========================================="
echo "Training complete!"
echo "=========================================="

