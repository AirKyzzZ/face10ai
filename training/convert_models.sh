#!/bin/bash

# Model Conversion Script for TensorFlow.js
# This script converts trained Keras models to TensorFlow.js format

echo "=========================================="
echo "Converting Beauty Recognition Models"
echo "to TensorFlow.js Format"
echo "=========================================="
echo ""

# Check if tensorflowjs is installed
if ! python3 -c "import tensorflowjs" 2>/dev/null; then
    echo "Error: tensorflowjs not found!"
    echo "Please install it with: pip install tensorflowjs"
    exit 1
fi

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
tensorflowjs_converter \
    --input_format keras \
    --quantize_uint8 \
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
tensorflowjs_converter \
    --input_format keras \
    --quantize_uint8 \
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

