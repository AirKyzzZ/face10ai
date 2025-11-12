# 🚀 Setup and Run Training (Quick Guide)

## The Problem You Had

```
ModuleNotFoundError: No module named 'numpy'
```

**Cause:** Virtual environment wasn't activated or dependencies weren't installed.

## ✅ Solution: Use the Helper Script

I've created a helper script that does everything for you:

```bash
cd training
./run_training.sh
```

This script will:
1. ✅ Activate virtual environment
2. ✅ Check if dependencies are installed
3. ✅ Install dependencies if needed
4. ✅ Run training script

## 📝 Manual Setup (Alternative)

If you prefer to do it manually:

### Step 1: Activate Virtual Environment

```bash
cd training
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 2: Install Dependencies

```bash
# Upgrade pip first
pip install --upgrade pip

# Install dependencies
pip install -r requirements-macos-silicon.txt
```

**This will take 5-10 minutes** (downloading TensorFlow and other packages).

### Step 3: Run Training

```bash
python train.py
```

## 🎯 Quick Commands

### Option 1: Use Helper Script (Easiest)

```bash
cd training
./run_training.sh
```

### Option 2: Manual Steps

```bash
cd training
source venv/bin/activate
pip install -r requirements-macos-silicon.txt
python train.py
```

## 🔍 Verify Installation

After installing dependencies, verify everything works:

```bash
source venv/bin/activate
python -c "import tensorflow as tf; print(f'TensorFlow {tf.__version__}')"
python -c "import numpy; print('NumPy OK')"
python -c "import cv2; print('OpenCV OK')"
```

Expected output:
```
TensorFlow 2.13.0
NumPy OK
OpenCV OK
```

## ⚠️ Common Issues

### Issue 1: "Command not found: python"

**Solution:** Use `python3` instead, or activate the venv first:
```bash
source venv/bin/activate
python --version  # Should show Python 3.11.x
```

### Issue 2: "ModuleNotFoundError: No module named 'numpy'"

**Solution:** Activate venv and install dependencies:
```bash
source venv/bin/activate
pip install -r requirements-macos-silicon.txt
```

### Issue 3: "tensorflow not found"

**Solution:** Make sure you're using the right requirements file:
```bash
pip install -r requirements-macos-silicon.txt
```

### Issue 4: Installation takes too long

**Solution:** This is normal! TensorFlow is a large package (~500MB). Just wait.

## 📊 What to Expect

### During Installation (5-10 minutes)

You'll see:
```
Collecting tensorflow-macos==2.13.0
Collecting numpy==1.24.3
...
Installing collected packages: numpy, tensorflow, ...
Successfully installed ...
```

### During Training (2-4 hours with GPU)

You'll see:
```
Step 1: Downloading SCUT-FBP5500 dataset...
Step 2: Loading full dataset...
Step 3: Loading MALE dataset...
Step 4: Loading FEMALE dataset...
Step 5: Setting up training configuration...
Step 6: Training MALE model...
STAGE 1: Training model head (base frozen)
Epoch 1/30
...
```

## 🎉 After Training Completes

You'll see:
```
============================================================
FINAL RESULTS SUMMARY
============================================================

Male Model:
  RMSE: 0.2845
  MAE:  0.2134

Female Model:
  RMSE: 0.2765
  MAE:  0.2056

Models saved to:
  - models/beauty_model_male.h5
  - models/beauty_model_female.h5
```

## 🚀 Next Steps

After training completes:

```bash
# Convert models to TensorFlow.js
./convert_models.sh
```

## 📝 Summary

**The easiest way:**

```bash
cd training
./run_training.sh
```

**Or manually:**

```bash
cd training
source venv/bin/activate
pip install -r requirements-macos-silicon.txt
python train.py
```

**Remember:** Always activate the virtual environment first!

---

**Need help?** Check `INSTALL_FIX.md` for more troubleshooting tips.

