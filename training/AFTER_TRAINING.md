# ✅ What to Do After Training is Complete

## Step-by-Step Guide

Once your training finishes successfully, follow these steps to use the AI models in your Next.js app.

## Step 1: Verify Models Were Created ✅

Check that the models were saved:

```bash
cd training
ls -lh models/
```

You should see:
```
beauty_model_male.h5      (~15-20MB)
beauty_model_female.h5    (~15-20MB)
```

If you don't see these files, training didn't complete successfully. Check the logs for errors.

## Step 2: Convert Models to TensorFlow.js 🔄

Convert the Keras models (.h5) to TensorFlow.js format:

### Option A: Use the Conversion Script (Recommended)

```bash
cd training
./convert_models.sh
```

This will:
1. Check if models exist
2. Convert both models to TensorFlow.js format
3. Place them in `../public/models/beauty_model_male/` and `../public/models/beauty_model_female/`

### Option B: Manual Conversion

```bash
cd training
source venv/bin/activate

# Convert male model
tensorflowjs_converter \
    --input_format keras \
    --quantize_uint8 \
    models/beauty_model_male.h5 \
    ../public/models/beauty_model_male/

# Convert female model
tensorflowjs_converter \
    --input_format keras \
    --quantize_uint8 \
    models/beauty_model_female.h5 \
    ../public/models/beauty_model_female/
```

## Step 3: Verify Converted Models 📦

Check that models were converted successfully:

```bash
cd ..  # Back to project root
ls -lh public/models/beauty_model_male/
ls -lh public/models/beauty_model_female/
```

You should see:
```
public/models/beauty_model_male/
├── model.json              (metadata)
└── group1-shard1of*.bin    (weight files)

public/models/beauty_model_female/
├── model.json              (metadata)
└── group1-shard1of*.bin    (weight files)
```

## Step 4: Check Training Performance 📊

Review training logs and metrics:

```bash
cd training
ls -lh logs/
```

You should see:
- `beauty_model_male_evaluation.png` - Prediction plots
- `beauty_model_male_training_history.png` - Training curves
- `beauty_model_female_evaluation.png` - Prediction plots
- `beauty_model_female_training_history.png` - Training curves

Check the console output for:
- **RMSE:** Should be < 0.30 (lower is better)
- **MAE:** Should be < 0.25 (lower is better)

**Good performance:**
- RMSE: 0.25-0.30 ✅
- MAE: 0.20-0.25 ✅

**Needs improvement:**
- RMSE: > 0.35 ⚠️
- MAE: > 0.30 ⚠️

## Step 5: Restart Your Next.js App 🔄

Restart the development server to load the new models:

```bash
cd ..  # Back to project root

# Stop the dev server (Ctrl+C if running)

# Restart it
npm run dev
```

## Step 6: Test the AI Models 🧪

1. **Open your app:** http://localhost:3000

2. **Check browser console:**
   - You should see: "✅ AI beauty models loaded successfully!"
   - NOT: "AI beauty models not found"

3. **Test with a photo:**
   - Upload a face photo
   - Select gender (male/female)
   - Click "Analyser mon visage"
   - Check console for: "AI prediction: X.XX for homme/femme"

4. **Verify scores are realistic:**
   - Model/celebrity faces: Should score 8.5-9.5 ✅
   - Average faces: Should score 6.0-7.5 ✅
   - Less attractive faces: Should score 4.0-6.0 ✅
   - **NOT all 8.5-9.0** (that was the old geometric system)

## Step 7: Compare Old vs New 🆚

Before (Geometric System):
- Everyone scored 8.5-9.0
- No real differentiation
- Based on math formulas

After (AI System):
- Scores spread across 4-10 range
- Real differentiation
- Based on learned human preferences

## Troubleshooting

### Models Don't Load

**Check:**
1. Models exist in `public/models/beauty_model_male/` and `beauty_model_female/`
2. `model.json` files exist
3. Weight files (`.bin`) exist
4. Restart Next.js dev server

**Fix:**
```bash
# Re-convert models
cd training
./convert_models.sh

# Restart app
cd ..
npm run dev
```

### Console Shows "Models not found"

**Cause:** Models weren't converted or placed correctly

**Fix:**
```bash
cd training
./convert_models.sh  # Re-convert
```

Then verify:
```bash
ls public/models/beauty_model_male/model.json
ls public/models/beauty_model_female/model.json
```

Both should exist.

### Scores Still Seem Random

**Check training metrics:**
- If RMSE > 0.35, models might need more training
- If MAE > 0.30, models might need more training

**Solution:**
- Train for more epochs
- Add more training data
- Check training plots for overfitting

### Models Too Large

If models are too large (>50MB each):

**Use uint16 quantization instead:**
```bash
tensorflowjs_converter \
    --input_format keras \
    --quantize_uint16 \
    models/beauty_model_male.h5 \
    ../public/models/beauty_model_male/
```

## Quick Checklist ✅

After training completes:

- [ ] Models saved to `training/models/`
- [ ] Models converted to TensorFlow.js
- [ ] Models placed in `public/models/beauty_model_male/` and `beauty_model_female/`
- [ ] Next.js app restarted
- [ ] Browser console shows "✅ AI beauty models loaded successfully!"
- [ ] Tested with photos - scores are realistic
- [ ] Scores differentiate properly (not all 8.5-9.0)

## Next Steps 🚀

Once everything works:

1. **Deploy to production** - Models will work the same way
2. **Monitor performance** - Check user feedback
3. **Improve models** - Retrain with more data if needed
4. **Collect feedback** - See if scores make sense to users

## Files to Keep 📁

**Training directory:**
- ✅ `models/*.h5` - Keep original Keras models (for retraining)
- ✅ `logs/*.png` - Keep training plots (for reference)

**Public directory:**
- ✅ `public/models/beauty_model_*/` - TensorFlow.js models (used in app)

**Can delete (optional):**
- ⚠️ `training/data/` - Dataset (can re-download if needed)
- ⚠️ `training/models/*_stage1.h5` - Intermediate checkpoints (optional)

## Summary

**After training completes:**

1. ✅ **Verify models exist:** `ls training/models/`
2. 🔄 **Convert to TensorFlow.js:** `./convert_models.sh`
3. 📦 **Check converted models:** `ls public/models/beauty_model_*/`
4. 🔄 **Restart app:** `npm run dev`
5. 🧪 **Test:** Upload photo and verify AI predictions work

**That's it! Your AI models are now ready to use! 🎉**

---

**Need help?** Check the training logs or console errors for more details.

