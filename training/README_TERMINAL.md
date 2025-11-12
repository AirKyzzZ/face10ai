# 🖥️ Run Training from Terminal

## Quick Start

Instead of using Jupyter notebook, you can run training directly from the terminal:

```bash
cd training
source venv/bin/activate  # Activate virtual environment
python train.py           # Run training script
```

That's it! The script will:
1. Download the dataset automatically
2. Train the male model
3. Train the female model
4. Save models to `models/` directory
5. Generate evaluation plots in `logs/` directory

## What's Different from Jupyter?

| Jupyter Notebook | Python Script |
|------------------|---------------|
| Opens web browser | Runs in terminal |
| Interactive cells | Runs all at once |
| Manual execution | Automated execution |
| Good for exploration | Good for production |

## Usage

### Basic Usage

```bash
cd training
source venv/bin/activate
python train.py
```

### With Python 3.11 (if needed)

```bash
cd training
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements-macos-silicon.txt
python train.py
```

### Run in Background (Optional)

```bash
# Run in background and save output to log file
nohup python train.py > training.log 2>&1 &

# Check progress
tail -f training.log

# Check if still running
ps aux | grep train.py
```

## Output

The script will:

1. **Download dataset** (~172MB) to `data/` directory
2. **Train models** (~2-4 hours with GPU)
3. **Save models** to `models/` directory:
   - `beauty_model_male.h5`
   - `beauty_model_female.h5`
4. **Generate plots** in `logs/` directory:
   - `beauty_model_male_evaluation.png`
   - `beauty_model_male_training_history.png`
   - `beauty_model_female_evaluation.png`
   - `beauty_model_female_training_history.png`

## Progress Output

You'll see output like this:

```
============================================================
Beauty Recognition Model Training
============================================================

TensorFlow version: 2.13.0
GPU Available: [PhysicalDevice(name='/physical_device:GPU:0', device_type='GPU')]
Num GPUs Available: 1

Step 1: Downloading SCUT-FBP5500 dataset...
Downloading dataset...
Extracting dataset...
SCUT-FBP5500 dataset ready!

Step 2: Loading full dataset...
Loading images from data/...
Loaded 5500 images

Total images: 5500
Image shape: (224, 224, 3)
Score range: 1.00 - 5.00

Step 3: Loading MALE dataset...
...
```

## Training Progress

During training, you'll see:

```
STAGE 1: Training model head (base frozen)
==================================================

Epoch 1/30
125/125 [==============================] - 45s 360ms/step - loss: 2.3456 - mae: 1.2345 - val_loss: 1.8765 - val_mae: 0.9876

Epoch 2/30
125/125 [==============================] - 42s 336ms/step - loss: 1.6543 - mae: 0.8765 - val_loss: 1.5432 - val_mae: 0.7654

...
```

## After Training

Once training completes, you'll see:

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

============================================================
Training Complete! ✨
============================================================

Next steps:
  1. Run: ./convert_models.sh
  2. Or manually convert with tensorflowjs_converter
```

## Next Steps

After training completes:

```bash
# Convert models to TensorFlow.js
./convert_models.sh

# Or manually:
tensorflowjs_converter --input_format keras models/beauty_model_male.h5 ../public/models/beauty_model_male/
tensorflowjs_converter --input_format keras models/beauty_model_female.h5 ../public/models/beauty_model_female/
```

## Troubleshooting

### "Module not found"

```bash
# Make sure venv is activated
source venv/bin/activate

# Install dependencies
pip install -r requirements-macos-silicon.txt
```

### "Out of memory"

Reduce batch size in `train.py`:

```python
batch_size = 16  # Instead of 32
```

### Training interrupted

The script saves checkpoints automatically. You can resume by modifying the script to load from checkpoint (advanced).

### Want to see plots?

Plots are saved to `logs/` directory as PNG files. Open them with:

```bash
open logs/beauty_model_male_evaluation.png
open logs/beauty_model_female_evaluation.png
```

## Advantages of Terminal Script

✅ **No browser needed** - Runs entirely in terminal  
✅ **Automated** - Runs all steps automatically  
✅ **Background** - Can run in background with `nohup`  
✅ **Logging** - Easy to save output to log file  
✅ **Production** - Better for production/deployment  
✅ **Scriptable** - Easy to automate with cron/jobs  

## Disadvantages

❌ **No interactivity** - Can't modify code on the fly  
❌ **No exploration** - Can't run cells individually  
❌ **Less visual** - Plots saved to files, not displayed  

## When to Use What

**Use Jupyter Notebook (`train.ipynb`)** when:
- Exploring the code
- Debugging issues
- Modifying parameters
- Learning how it works

**Use Python Script (`train.py`)** when:
- Running production training
- Training on remote server
- Automating training
- Running in background

## Summary

**To run training from terminal:**

```bash
cd training
source venv/bin/activate
python train.py
```

**That's it!** The script handles everything automatically. 🎉

---

**Need help?** Check `INSTALL_FIX.md` for installation issues or `DEPLOYMENT_GUIDE.md` for full guide.

