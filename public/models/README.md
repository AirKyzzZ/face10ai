# Models Directory

This directory contains the face detection and AI beauty recognition models.

## Face Detection Models (Already Installed)

These models are used for face detection and landmark detection:
- `tiny_face_detector_model-*` - Face detection
- `face_landmark_68_model-*` - Facial landmark detection
- `face_recognition_model-*` - Face recognition

## AI Beauty Models (To Be Trained)

These models will be created after training:

### After Training and Conversion:

```
public/models/
├── beauty_model_male/
│   ├── model.json
│   └── group1-shard*.bin
└── beauty_model_female/
    ├── model.json
    └── group1-shard*.bin
```

### To Create These Models:

1. **Train the models:**
   ```bash
   cd training
   source venv/bin/activate
   python train.py
   ```

2. **Convert to TensorFlow.js:**
   ```bash
   cd training
   ./convert_models.sh
   ```

3. **Models will be automatically placed here**

## Current Status

- ✅ Face detection models: Installed and working
- ⏳ AI beauty models: Not trained yet (will use geometric analysis as fallback)

## Fallback Behavior

If AI beauty models are not found, the system automatically falls back to geometric analysis. This is normal until models are trained.

## After Training

Once models are trained and converted, they will automatically be used for beauty prediction, providing more accurate results than geometric analysis.

