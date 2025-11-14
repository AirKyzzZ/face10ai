#!/bin/bash

# Model Conversion Script for TensorFlow.js
# This script converts trained Keras models to TensorFlow.js format
# Run this AFTER training is complete

echo "=========================================="
echo "Converting Beauty Recognition Models"
echo "to TensorFlow.js Format"
echo "=========================================="
echo ""
echo "ℹ️  This script converts trained models for use in the browser."
echo ""

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    # shellcheck disable=SC1091
    source venv/bin/activate
    PYTHON_CMD="python"
    if [ -f "venv/bin/tensorflowjs_converter" ]; then
        CONVERTER_CMD=("venv/bin/tensorflowjs_converter")
    else
        CONVERTER_CMD=("$PYTHON_CMD" "-m" "tensorflowjs.converters.convert")
    fi
else
    PYTHON_CMD="python3"
    echo "Warning: Virtual environment not found. Using system Python."
    if command -v tensorflowjs_converter &> /dev/null; then
        CONVERTER_CMD=("tensorflowjs_converter")
    else
        CONVERTER_CMD=("$PYTHON_CMD" "-m" "tensorflowjs.converters.convert")
    fi
fi

# Check if tensorflowjs is installed
if ! $PYTHON_CMD -c "import tensorflowjs" 2>/dev/null; then
    echo "Error: tensorflowjs not found!"
    echo "Please install it with: pip install tensorflowjs"
    echo "Or activate venv and install: source venv/bin/activate && pip install -r requirements-simple.txt"
    exit 1
fi

echo "Using converter: ${CONVERTER_CMD[*]}"

# Check if models exist
if [ ! -f "models/beauty_model_male.h5" ]; then
    echo "Error: beauty_model_male.h5 not found!"
    echo "Please train the models first using train.ipynb"
    exit 1
fi

if [ ! -f "models/beauty_model_female.h5" ]; then
    echo "Error: beauty_model_female.h5 not found!"
    echo "Please train the models first using train.ipynb"
    exit 1
fi

# Create output directories
mkdir -p ../public/models/beauty_model_male
mkdir -p ../public/models/beauty_model_female

echo "Converting male model..."
"${CONVERTER_CMD[@]}" \
    --input_format keras \
    --quantization_bytes 1 \
    models/beauty_model_male.h5 \
    ../public/models/beauty_model_male/

if [ $? -eq 0 ]; then
    echo "✓ Male model converted successfully!"
else
    echo "✗ Failed to convert male model"
    exit 1
fi

echo ""
echo "Converting female model..."
"${CONVERTER_CMD[@]}" \
    --input_format keras \
    --quantization_bytes 1 \
    models/beauty_model_female.h5 \
    ../public/models/beauty_model_female/

if [ $? -eq 0 ]; then
    echo "✓ Female model converted successfully!"
else
    echo "✗ Failed to convert female model"
    exit 1
fi

echo ""
echo "=========================================="
echo "Conversion Complete!"
echo "=========================================="
echo ""
echo "Models saved to:"
echo "  - ../public/models/beauty_model_male/"
echo "  - ../public/models/beauty_model_female/"
echo ""
echo "You can now integrate these models in your Next.js app!"

