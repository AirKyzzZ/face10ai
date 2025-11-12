# 🔧 Fix NumPy Compilation Error

## The Problem

You're getting this error:
```
clang: error: the clang compiler does not support 'faltivec'
ERROR: Failed to build wheel for numpy
```

**Cause:** NumPy 1.24.3 is trying to build from source with PowerPC flags that don't work on Apple Silicon.

## ✅ Solution: Use Newer NumPy with Pre-built Wheels

Instead of building from source, use a newer NumPy version that has pre-built wheels for Apple Silicon.

### Option 1: Use Simplified Requirements (Recommended)

```bash
cd training
source venv/bin/activate
pip install -r requirements-simple.txt
```

This uses newer versions that have pre-built wheels, so no compilation needed!

### Option 2: Update NumPy Manually

```bash
cd training
source venv/bin/activate

# Uninstall old numpy if installed
pip uninstall numpy -y

# Install newer numpy with pre-built wheels
pip install "numpy>=1.26.0"

# Then install other dependencies
pip install -r requirements-macos-silicon.txt
```

### Option 3: Install All Packages Individually

```bash
cd training
source venv/bin/activate

# Upgrade pip first
pip install --upgrade pip

# Install packages one by one (newer versions)
pip install "numpy>=1.26.0"
pip install "pandas>=2.0.3"
pip install "opencv-python>=4.8.0"
pip install "Pillow>=10.0.0"
pip install "scikit-learn>=1.3.2"
pip install "matplotlib>=3.8.0"
pip install "seaborn>=0.13.0"
pip install "gdown>=4.7.0"
pip install "tqdm>=4.66.0"

# Install TensorFlow for Apple Silicon
pip install tensorflow-macos tensorflow-metal

# Install TensorFlow.js converter
pip install tensorflowjs
```

## 🎯 Quick Fix

**The easiest solution:**

```bash
cd training
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements-simple.txt
```

This should install everything without compilation errors!

## 📝 Why This Happens

1. **NumPy 1.24.3** tries to build from source on some systems
2. **Build process** includes PowerPC-specific flags (`-faltivec`)
3. **Apple Silicon** doesn't support these flags
4. **Solution:** Use newer NumPy (1.26+) with pre-built wheels

## ✅ Verify Installation

After installing, verify everything works:

```bash
source venv/bin/activate
python -c "import numpy; print(f'NumPy {numpy.__version__}')"
python -c "import tensorflow as tf; print(f'TensorFlow {tf.__version__}')"
python -c "import cv2; print('OpenCV OK')"
```

Expected output:
```
NumPy 1.26.x
TensorFlow 2.13.0
OpenCV OK
```

## 🚀 After Fixing

Once dependencies are installed, run training:

```bash
source venv/bin/activate
python train.py
```

## 🔍 Alternative: Use Conda (If pip still fails)

If pip continues to have issues, you can use conda:

```bash
# Install miniconda first (if not installed)
# brew install miniconda

# Create conda environment
conda create -n beauty-training python=3.11
conda activate beauty-training

# Install packages with conda
conda install numpy pandas matplotlib scikit-learn opencv -y
conda install -c apple tensorflow-deps -y
pip install tensorflow-macos tensorflow-metal
pip install tensorflowjs gdown tqdm seaborn
```

## 📊 Summary

**The Problem:**
- NumPy 1.24.3 tries to build from source
- Includes PowerPC flags that don't work on Apple Silicon
- Compilation fails

**The Solution:**
- Use NumPy 1.26+ with pre-built wheels
- Use `requirements-simple.txt` instead
- No compilation needed!

**Quick Fix:**
```bash
cd training
source venv/bin/activate
pip install -r requirements-simple.txt
```

---

**After fixing, continue with:** `python train.py`

