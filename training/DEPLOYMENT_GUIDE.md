# AI Beauty Model Deployment Guide

This guide walks you through training and deploying the AI-powered beauty recognition models.

## Prerequisites

- Python 3.9+ installed
- Node.js and npm installed
- **GPU recommended** (training will be much faster)
- ~5GB free disk space

## Step 1: Set Up Python Environment

```bash
cd training

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Step 2: Train the Models

### Option A: Use Jupyter Notebook (Recommended)

```bash
# Start Jupyter
jupyter notebook

# Open train.ipynb and run all cells
# This will:
# 1. Download SCUT-FBP5500 dataset (~172MB)
# 2. Preprocess images
# 3. Train male model (Stage 1 + Stage 2)
# 4. Train female model (Stage 1 + Stage 2)
# 5. Evaluate both models
# 6. Save models to models/ directory
```

**Expected training time:**
- With GPU: 2-4 hours
- With CPU: 8-12 hours

### Option B: Command Line (Alternative)

If you prefer command line, you can convert the notebook to a Python script:

```bash
jupyter nbconvert --to script train.ipynb
python train.py
```

## Step 3: Verify Trained Models

After training, verify that models were saved:

```bash
ls -lh models/

# You should see:
# beauty_model_male.h5      (~15MB)
# beauty_model_female.h5    (~15MB)
```

Check the training logs for performance metrics:

```bash
cat logs/*

# Target metrics:
# RMSE < 0.30
# MAE < 0.25
```

## Step 4: Convert Models to TensorFlow.js

Make the conversion script executable and run it:

```bash
chmod +x convert_models.sh
./convert_models.sh
```

This will:
1. Convert both models to TensorFlow.js format
2. Apply uint8 quantization (reduces size)
3. Save to `../public/models/beauty_model_male/` and `../public/models/beauty_model_female/`

**Verify conversion:**

```bash
ls -lh ../public/models/beauty_model_male/
ls -lh ../public/models/beauty_model_female/

# Each should contain:
# - model.json (metadata)
# - group1-shard1of* (weight files)
```

## Step 5: Install TensorFlow.js in Next.js App

```bash
cd ..  # Go back to project root
npm install
```

The package.json has already been updated with `@tensorflow/tfjs` dependency.

## Step 6: Test the Integration

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 and:

1. Select gender (male or female)
2. Upload a face photo
3. Click "Analyser mon visage"
4. Check browser console for logs:
   - "Loading AI beauty models..."
   - "AI beauty models loaded successfully!"
   - "AI prediction: X.XX for homme/femme"

## Step 7: Verify AI is Working

**Check console logs:**

```
✓ AI models loaded: You should see AI prediction logs
✗ AI models not loaded: You'll see "using geometric analysis"
```

**If AI models aren't loading:**

1. Check that model files exist in `public/models/`
2. Check browser console for error messages
3. Verify model.json files are valid JSON
4. Try hard refresh (Ctrl+Shift+R)

## Step 8: Compare Results

To verify the AI is working better than geometric calculations:

### Test with diverse faces:

1. **Model/celebrity faces** → Should score 8.5-9.5
2. **Average faces** → Should score 6.0-7.5
3. **Less attractive faces** → Should score 4.0-6.0
4. **Different ethnicities** → Should have varied, realistic scores

### Expected improvements:

- ✓ Better differentiation between attractive vs average faces
- ✓ More consistent scoring across different face types
- ✓ Scores based on learned human preferences, not geometry
- ✓ Less clustering around 8.5-9.0

## Troubleshooting

### "CUDA out of memory" during training

```bash
# Reduce batch size in train.ipynb
BATCH_SIZE = 16  # Instead of 32
```

### "Module not found" errors

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Models not loading in browser

```bash
# Check file permissions
chmod -R 755 public/models/

# Verify Next.js static file serving
# Files in public/ should be accessible at /models/
```

### AI predictions seem random

- Check that models trained for enough epochs
- Verify RMSE < 0.30 and MAE < 0.25
- Try retraining with more data augmentation

### Conversion fails

```bash
# Install specific tensorflowjs version
pip install tensorflowjs==4.11.0

# Try without quantization
tensorflowjs_converter \
    --input_format keras \
    models/beauty_model_male.h5 \
    ../public/models/beauty_model_male/
```

## Performance Optimization

### Reduce model size (if needed)

```bash
# Convert with uint16 quantization (even smaller)
tensorflowjs_converter \
    --input_format keras \
    --quantize_uint16 \
    models/beauty_model_male.h5 \
    ../public/models/beauty_model_male/
```

### Improve inference speed

- Models are already optimized (MobileNetV2 is fast)
- Typical inference: 200-300ms in browser
- Uses WebGL acceleration automatically

## Production Deployment

### Before deploying:

1. Test on multiple devices and browsers
2. Verify models load on production domain
3. Check CORS headers if models hosted separately
4. Monitor browser console for errors

### Deploy checklist:

- [ ] Models trained and evaluated (RMSE < 0.30)
- [ ] Models converted to TensorFlow.js
- [ ] Models placed in `public/models/`
- [ ] npm install completed
- [ ] Local testing successful
- [ ] AI predictions visible in logs
- [ ] Realistic score distribution observed

## Improving Model Accuracy

### Add more training data:

1. **CelebA dataset** - Celebrity faces with ratings
2. **Chicago Face Database** - Diverse, annotated faces
3. **Custom data** - Collect and rate images yourself

### Tune hyperparameters:

- Adjust learning rates
- Modify batch sizes
- Try different augmentation strategies
- Experiment with model architecture

### Monitor and iterate:

1. Collect user feedback
2. Analyze score distributions
3. Identify problematic cases
4. Retrain with focused improvements

## Next Steps

Once everything is working:

1. Monitor real-world performance
2. Collect analytics on score distribution
3. Consider A/B testing AI vs geometric
4. Plan for periodic model retraining with new data

## Support

If you encounter issues:

1. Check the training logs in `logs/`
2. Review error messages in browser console
3. Verify all files are in correct locations
4. Try the geometric fallback to isolate issues

The system is designed to gracefully fall back to geometric analysis if AI models aren't available, so it should never completely break.

---

**Good luck with your AI-powered beauty recognition system! 🎉**

