# Installation Fix for macOS Apple Silicon

## Issue

You're getting: `ERROR: No matching distribution found for tensorflow>=2.13.0`

**Cause:** Python 3.14 is too new. TensorFlow currently supports Python 3.9-3.11 only.

## Solution: Install Python 3.11

### Option 1: Using Homebrew (Recommended)

```bash
# Install Python 3.11
brew install python@3.11

# Create virtual environment with Python 3.11
cd training
python3.11 -m venv venv
source venv/bin/activate

# Verify Python version
python --version  # Should show Python 3.11.x

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### Option 2: Using pyenv

```bash
# Install pyenv (if not installed)
brew install pyenv

# Install Python 3.11
pyenv install 3.11.7

# Use Python 3.11 for this directory
cd training
pyenv local 3.11.7

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### Option 3: Manual Installation

If the above fails, install packages one by one:

```bash
cd training
python3.11 -m venv venv  # Use Python 3.11!
source venv/bin/activate

# Install TensorFlow for Apple Silicon
pip install tensorflow-macos==2.13.0
pip install tensorflow-metal==1.0.0

# Install other packages
pip install numpy pandas matplotlib seaborn scikit-learn
pip install opencv-python Pillow
pip install gdown tqdm
pip install jupyter ipykernel ipywidgets
pip install tensorflowjs
```

## Verification

After installation, verify TensorFlow works:

```bash
python -c "import tensorflow as tf; print(f'TensorFlow {tf.__version__}'); print(f'GPU: {tf.config.list_physical_devices(\"GPU\")}')"
```

Expected output:
```
TensorFlow 2.13.x
GPU: [PhysicalDevice(name='/physical_device:GPU:0', device_type='GPU')]
```

## Apple Silicon Notes

✅ **tensorflow-macos** - TensorFlow optimized for Apple Silicon  
✅ **tensorflow-metal** - GPU acceleration (uses Apple's Metal API)  
✅ Your M-series chip will be used for training (much faster!)

## Still Having Issues?

### Error: "No module named 'tensorflow'"

```bash
# Make sure venv is activated
source venv/bin/activate

# Reinstall
pip install --upgrade tensorflow-macos tensorflow-metal
```

### Error: "Could not find a version that satisfies..."

```bash
# Update pip first
pip install --upgrade pip

# Try installing with specific versions
pip install tensorflow-macos==2.13.0 tensorflow-metal==1.0.0
```

### Training is slow / Not using GPU

Check Metal GPU support:

```python
import tensorflow as tf
print("Num GPUs:", len(tf.config.list_physical_devices('GPU')))
print("GPU devices:", tf.config.list_physical_devices('GPU'))
```

If no GPU is detected:
```bash
pip install --upgrade tensorflow-metal
```

## Quick Start After Fix

```bash
cd training
source venv/bin/activate  # Always activate venv first!
jupyter notebook
# Open train.ipynb and run all cells
```

## Summary

**The Fix:**
1. Use Python 3.11 (not 3.14)
2. Use `tensorflow-macos` (for Apple Silicon)
3. Install `tensorflow-metal` (for GPU acceleration)

**Why This Happened:**
- TensorFlow doesn't support Python 3.14 yet
- Apple Silicon Macs need special TensorFlow builds

**Training Time (with GPU):**
- With Metal GPU: 2-4 hours ✅
- Without GPU: 8-12 hours ⚠️

---

**After fixing, continue with:** `jupyter notebook` → Open `train.ipynb` → Run All

