#!/bin/bash

# Use the pre-trained AttractiveNet model (attractiveNet_mnv2.h5)
# Converts it twice (male/female) so the frontend can load both genders

set -e  # Exit immediately on error

MODEL_PATH="models/attractiveNet_mnv2.h5"
TARGET_MALE="../public/models/beauty_model_male"
TARGET_FEMALE="../public/models/beauty_model_female"

echo "=========================================="
echo "Using Pre-Trained AttractiveNet Model"
echo "=========================================="
echo ""

if [ ! -f "$MODEL_PATH" ]; then
    echo "Error: $MODEL_PATH not found!"
    echo "Please place attractiveNet_mnv2.h5 in the training/models/ directory."
    exit 1
fi

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

# Ensure tensorflowjs is installed
if ! $PYTHON_CMD -c "import tensorflowjs" 2>/dev/null; then
    echo "Error: tensorflowjs not found!"
    echo "Install it with: pip install tensorflowjs"
    echo "Or activate venv and run: pip install -r requirements-simple.txt"
    exit 1
fi

echo "Using converter: ${CONVERTER_CMD[*]}"

# Create output folders
mkdir -p "$TARGET_MALE"
mkdir -p "$TARGET_FEMALE"

echo ""
echo "Converting AttractiveNet model for MALE pipeline..."
"${CONVERTER_CMD[@]}" \
    --input_format keras \
    --quantization_bytes 1 \
    "$MODEL_PATH" \
    "$TARGET_MALE"

echo ""
echo "Converting AttractiveNet model for FEMALE pipeline..."
"${CONVERTER_CMD[@]}" \
    --input_format keras \
    --quantization_bytes 1 \
    "$MODEL_PATH" \
    "$TARGET_FEMALE"

echo ""
echo "=========================================="
echo "Conversion complete!"
echo "=========================================="
echo ""
echo "Models available at:"
echo "  - $TARGET_MALE"
echo "  - $TARGET_FEMALE"
echo ""
echo "Restart your Next.js app (npm run dev) and test the website."

