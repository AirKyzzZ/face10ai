# Quick Start: AI Beauty Model Training

This is a quick reference for training and deploying the AI beauty recognition models.

## 🚀 Quick Commands

```bash
# 1. Set up training environment
cd training
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. Train models (2-4 hours with GPU)
jupyter notebook
# Open train.ipynb and run all cells

# 3. Convert models to TensorFlow.js
chmod +x convert_models.sh
./convert_models.sh

# 4. Install dependencies and run
cd ..
npm install
npm run dev
```

## 📋 What Was Implemented

### ✅ Completed

1. **Training Environment**
   - Python environment with all dependencies (`training/requirements.txt`)
   - Dataset download utilities (`training/utils/data_helper.py`)
   - Complete training notebook (`training/train.ipynb`)
   - Model conversion script (`training/convert_models.sh`)

2. **AI Integration**
   - TensorFlow.js added to Next.js app (`@tensorflow/tfjs` in `package.json`)
   - AI-powered face rating (`lib/face-rating.ts` updated)
   - Gender-specific model loading (male/female)
   - Automatic fallback to geometric analysis
   - Face preprocessing for model input (224x224)

3. **Architecture**
   - Transfer learning with MobileNetV2 (lightweight, fast)
   - Two-stage training (frozen base → fine-tuning)
   - Separate models for male and female faces
   - Browser-based inference (no backend needed)

### ⏳ Requires User Action

1. **Train Models** - Run `training/train.ipynb` notebook (~2-4 hours)
2. **Convert Models** - Run `training/convert_models.sh` after training
3. **Test System** - Verify AI predictions work correctly

## 🎯 Expected Results

### Before (Geometric System):
- Everyone scoring 8.5-9.0
- No real differentiation
- Based on math formulas

### After (AI System):
- Models: 8.5-9.5
- Average: 6.0-7.5
- Below Average: 4.0-6.0
- Based on learned human preferences

## 🔍 How to Verify It's Working

1. **Check browser console:**
   ```
   Loading AI beauty models...
   AI beauty models loaded successfully!
   AI prediction: 7.85 for homme
   ```

2. **Test with diverse faces:**
   - Upload model/celebrity photo → Should score high (8.5+)
   - Upload average person photo → Should score mid-range (6-8)
   - Upload less attractive photo → Should score lower (4-6)

3. **No more clustering:** Scores should be spread across the range, not all 8.5-9.0

## 📁 Project Structure

```
training/
├── requirements.txt           # Python dependencies
├── train.ipynb               # Main training notebook
├── convert_models.sh         # Model conversion script
├── README.md                 # Full documentation
├── DEPLOYMENT_GUIDE.md       # Detailed deployment guide
├── utils/
│   ├── data_helper.py       # Dataset utilities
│   └── __init__.py
├── data/                    # Downloaded datasets (auto-created)
├── models/                  # Trained models (auto-created)
└── logs/                    # Training logs (auto-created)

lib/
└── face-rating.ts           # AI-powered rating logic (UPDATED)

public/models/
├── beauty_model_male/       # Converted male model (after training)
└── beauty_model_female/     # Converted female model (after training)
```

## 🛠️ Technology Stack

- **Training:** Python, TensorFlow, Keras, MobileNetV2
- **Dataset:** SCUT-FBP5500 (5500 faces with beauty ratings)
- **Deployment:** TensorFlow.js (browser-based inference)
- **Frontend:** Next.js, React, TypeScript
- **Face Detection:** face-api.js (unchanged)

## 📊 Model Performance Targets

- **RMSE:** < 0.30 (Root Mean Squared Error)
- **MAE:** < 0.25 (Mean Absolute Error)
- **Inference Time:** < 500ms in browser
- **Model Size:** ~4-6MB per model (compressed)

## 🚨 Important Notes

1. **Training is required:** The system is ready, but you need to train the models locally
2. **GPU recommended:** Training on CPU will take 8-12 hours vs 2-4 hours on GPU
3. **Fallback included:** If models aren't loaded, system falls back to geometric analysis
4. **Two models needed:** Train both male and female models for best results
5. **Browser compatibility:** Uses WebGL acceleration, works on modern browsers

## 💡 Quick Tips

- **Monitor training:** Watch validation loss - should decrease steadily
- **Early stopping:** Training stops automatically if no improvement
- **Model checkpoints:** Best models saved automatically during training
- **Test before deploying:** Always verify models work locally first

## 📚 Documentation

- **Full training details:** See `training/README.md`
- **Step-by-step deployment:** See `training/DEPLOYMENT_GUIDE.md`
- **Troubleshooting:** Check DEPLOYMENT_GUIDE.md for common issues

## 🎉 Ready to Start!

```bash
# Start here:
cd training
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
jupyter notebook
# Open train.ipynb and begin training!
```

---

**Need help?** Check the logs in `training/logs/` and browser console for debugging info.

