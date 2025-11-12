# Beauty Recognition Model Training

This directory contains the training pipeline for the AI-powered beauty recognition system used in combiensur10.fr.

## Overview

The system uses transfer learning with MobileNetV2 to create gender-specific beauty recognition models that predict attractiveness scores from facial images. The models are trained on diverse datasets and converted to TensorFlow.js for browser-based inference.

## Setup

### 1. Create Python Virtual Environment

```bash
cd training
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Start Jupyter Notebook

```bash
jupyter notebook
```

Open `train.ipynb` to begin training.

## Training Pipeline

### Step 1: Dataset Download

The notebook automatically downloads the SCUT-FBP5500 dataset:
- 5500 facial images (3750 male, 1750 female)
- Beauty scores rated by human evaluators
- Diverse ages and ethnicities

### Step 2: Data Preprocessing

- Images resized to 224×224 (MobileNetV2 standard)
- RGB normalization (0-1 range)
- Gender-based splitting (separate models for male/female)
- Data split: 70% train, 20% validation, 10% test

### Step 3: Model Training

**Architecture:**
- Base: MobileNetV2 (pre-trained on ImageNet)
- Custom head: Single dense layer (regression output)

**Training Strategy:**
- **Stage 1:** Train only the custom head (base frozen)
  - 20-30 epochs
  - Learning rate: 0.001
- **Stage 2:** Fine-tune entire model
  - 20-30 epochs
  - Learning rate: 0.0001

**Two separate models trained:**
- `beauty_model_male.h5` - For male faces
- `beauty_model_female.h5` - For female faces

### Step 4: Model Conversion

Convert trained Keras models to TensorFlow.js format:

```bash
tensorflowjs_converter \
    --input_format keras \
    models/beauty_model_male.h5 \
    ../public/models/beauty_model_male/

tensorflowjs_converter \
    --input_format keras \
    models/beauty_model_female.h5 \
    ../public/models/beauty_model_female/
```

## Project Structure

```
training/
├── README.md                 # This file
├── requirements.txt          # Python dependencies
├── train.ipynb              # Main training notebook
├── utils/
│   ├── __init__.py
│   └── data_helper.py       # Dataset utilities
├── data/                    # Downloaded datasets (gitignored)
├── models/                  # Trained models (gitignored)
└── logs/                    # Training logs (gitignored)
```

## Model Performance Metrics

Target metrics:
- **RMSE:** < 0.30
- **MAE:** < 0.25
- **Inference time:** < 500ms (browser)

## Dataset Sources

1. **SCUT-FBP5500**
   - Source: South China University of Technology
   - Paper: [A New Dataset with Multi-Paradigm Annotations](https://arxiv.org/pdf/1801.06345.pdf)
   - Size: 5500 images
   - Scores: 1-5 scale (normalized to 0-10)

## Training Tips

### Hardware Requirements
- **GPU:** Recommended (NVIDIA with CUDA support)
- **RAM:** 8GB minimum, 16GB recommended
- **Storage:** 2GB for datasets and models
- **Training time:** 2-4 hours with GPU, 8-12 hours with CPU

### Improving Model Accuracy

1. **Add more diverse datasets:**
   - CelebA with attractiveness annotations
   - Chicago Face Database
   - Custom collected data

2. **Tune hyperparameters:**
   - Adjust learning rates
   - Modify batch sizes
   - Experiment with different augmentations

3. **Try different architectures:**
   - EfficientNet (better accuracy, larger size)
   - ResNet50 (more capacity)
   - Custom CNN architectures

4. **Data augmentation:**
   - Horizontal flips (already included)
   - Slight rotations
   - Brightness/contrast adjustments
   - Zoom variations

## Troubleshooting

### "Out of Memory" Error
- Reduce batch size in the notebook
- Use smaller images (though 224×224 is optimal for MobileNetV2)
- Close other applications

### Poor Model Performance
- Check data distribution (scores should be relatively balanced)
- Ensure sufficient training epochs
- Verify data preprocessing is correct
- Consider adding more training data

### Conversion Issues
- Ensure tensorflowjs is installed: `pip install tensorflowjs`
- Check TensorFlow version compatibility
- Use absolute paths in conversion commands

## Next Steps

After training:
1. Convert models to TensorFlow.js format
2. Copy converted models to `../public/models/`
3. Integrate models in `../lib/face-rating.ts`
4. Test with diverse facial images
5. Deploy and monitor performance

## References

- [AttractiveNet GitHub](https://github.com/gustavz/AttractiveNet)
- [SCUT-FBP5500 Paper](https://arxiv.org/pdf/1801.06345.pdf)
- [MobileNetV2 Paper](https://arxiv.org/abs/1801.04381)
- [TensorFlow.js Documentation](https://www.tensorflow.org/js)

## License

This training pipeline is for the combiensur10.fr project. Dataset licenses apply separately.

