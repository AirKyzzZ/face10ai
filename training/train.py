#!/usr/bin/env python3
"""
Beauty Recognition Model Training Script
Run this from terminal: python train.py
"""

import os
import sys
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.preprocessing.image import ImageDataGenerator

from sklearn.metrics import mean_squared_error, mean_absolute_error

# Import custom utilities
from utils.data_helper import (
    download_scut_fbp5500,
    load_dataset,
    split_dataset,
    normalize_scores_to_10_scale,
    get_dataset_statistics
)

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)


def build_beauty_model(input_shape=(224, 224, 3), trainable_base=False):
    """
    Build a beauty recognition model using MobileNetV2.
    
    Args:
        input_shape: Input image shape
        trainable_base: Whether to make base model trainable
    
    Returns:
        Compiled Keras model
    """
    # Load MobileNetV2 with pre-trained ImageNet weights
    base_model = MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet',
        pooling='avg'  # Global average pooling
    )
    
    # Freeze base model initially
    base_model.trainable = trainable_base
    
    # Build model
    model = Sequential([
        base_model,
        Dropout(0.2),
        Dense(1, activation='linear')  # Single output for regression
    ], name='BeautyNet_MobileNetV2')
    
    return model, base_model


def train_model(X, y, model_name, gender, batch_size, epochs_stage1, epochs_stage2, 
                lr_stage1, lr_stage2, train_datagen, val_test_datagen):
    """
    Train a beauty recognition model in two stages.
    
    Args:
        X: Input images
        y: Target scores
        model_name: Name for saving the model
        gender: 'male' or 'female'
    
    Returns:
        Trained model and training history
    """
    print(f"\n{'='*60}")
    print(f"Training {gender.upper()} model: {model_name}")
    print(f"{'='*60}\n")
    
    # Split dataset
    X_train, X_val, X_test, y_train, y_val, y_test = split_dataset(
        X, y, test_size=0.1, val_size=0.2, random_state=42
    )
    
    # Create data generators
    train_generator = train_datagen.flow(X_train, y_train, batch_size=batch_size)
    val_generator = val_test_datagen.flow(X_val, y_val, batch_size=batch_size)
    
    # STAGE 1: Train only the head
    print(f"\n{'='*50}")
    print("STAGE 1: Training model head (base frozen)")
    print(f"{'='*50}\n")
    
    model, base_model = build_beauty_model(trainable_base=False)
    
    model.compile(
        optimizer=Adam(learning_rate=lr_stage1),
        loss='mean_squared_error',
        metrics=['mae']
    )
    
    print("Model Summary:")
    model.summary()
    
    callbacks_stage1 = [
        ModelCheckpoint(
            f'models/{model_name}_stage1.h5',
            monitor='val_loss',
            save_best_only=True,
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=7,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            verbose=1
        )
    ]
    
    history_stage1 = model.fit(
        train_generator,
        epochs=epochs_stage1,
        validation_data=val_generator,
        callbacks=callbacks_stage1,
        verbose=1
    )
    
    # STAGE 2: Fine-tune entire model
    print(f"\n{'='*50}")
    print("STAGE 2: Fine-tuning entire model")
    print(f"{'='*50}\n")
    
    base_model.trainable = True
    
    model.compile(
        optimizer=Adam(learning_rate=lr_stage2),
        loss='mean_squared_error',
        metrics=['mae']
    )
    
    print(f"Total trainable parameters: {model.count_params():,}")
    
    callbacks_stage2 = [
        ModelCheckpoint(
            f'models/{model_name}.h5',
            monitor='val_loss',
            save_best_only=True,
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=4,
            verbose=1
        )
    ]
    
    history_stage2 = model.fit(
        train_generator,
        epochs=epochs_stage2,
        validation_data=val_generator,
        callbacks=callbacks_stage2,
        verbose=1
    )
    
    # EVALUATION
    print(f"\n{'='*50}")
    print("EVALUATION ON TEST SET")
    print(f"{'='*50}\n")
    
    y_pred = model.predict(X_test, batch_size=batch_size, verbose=1).flatten()
    
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"Test RMSE: {rmse:.4f}")
    print(f"Test MAE: {mae:.4f}")
    
    # Plot predictions vs actual
    plt.figure(figsize=(10, 5))
    
    plt.subplot(1, 2, 1)
    plt.scatter(y_test, y_pred, alpha=0.5)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    plt.xlabel('Actual Score')
    plt.ylabel('Predicted Score')
    plt.title(f'{gender.capitalize()} Model: Predictions vs Actual')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(1, 2, 2)
    errors = y_pred - y_test
    plt.hist(errors, bins=30, edgecolor='black', alpha=0.7)
    plt.xlabel('Prediction Error')
    plt.ylabel('Frequency')
    plt.title('Error Distribution')
    plt.axvline(0, color='red', linestyle='--')
    
    plt.tight_layout()
    os.makedirs('logs', exist_ok=True)
    plt.savefig(f'logs/{model_name}_evaluation.png', dpi=150)
    print(f"Evaluation plot saved to logs/{model_name}_evaluation.png")
    plt.close()
    
    # Plot training history
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle(f'Training History: {model_name}', fontsize=16)
    
    # Stage 1 Loss
    axes[0, 0].plot(history_stage1.history['loss'], label='Train Loss')
    axes[0, 0].plot(history_stage1.history['val_loss'], label='Val Loss')
    axes[0, 0].set_title('Stage 1: Loss')
    axes[0, 0].set_xlabel('Epoch')
    axes[0, 0].set_ylabel('Loss (MSE)')
    axes[0, 0].legend()
    axes[0, 0].grid(True, alpha=0.3)
    
    # Stage 1 MAE
    axes[0, 1].plot(history_stage1.history['mae'], label='Train MAE')
    axes[0, 1].plot(history_stage1.history['val_mae'], label='Val MAE')
    axes[0, 1].set_title('Stage 1: MAE')
    axes[0, 1].set_xlabel('Epoch')
    axes[0, 1].set_ylabel('MAE')
    axes[0, 1].legend()
    axes[0, 1].grid(True, alpha=0.3)
    
    # Stage 2 Loss
    axes[1, 0].plot(history_stage2.history['loss'], label='Train Loss')
    axes[1, 0].plot(history_stage2.history['val_loss'], label='Val Loss')
    axes[1, 0].set_title('Stage 2: Loss')
    axes[1, 0].set_xlabel('Epoch')
    axes[1, 0].set_ylabel('Loss (MSE)')
    axes[1, 0].legend()
    axes[1, 0].grid(True, alpha=0.3)
    
    # Stage 2 MAE
    axes[1, 1].plot(history_stage2.history['mae'], label='Train MAE')
    axes[1, 1].plot(history_stage2.history['val_mae'], label='Val MAE')
    axes[1, 1].set_title('Stage 2: MAE')
    axes[1, 1].set_xlabel('Epoch')
    axes[1, 1].set_ylabel('MAE')
    axes[1, 1].legend()
    axes[1, 1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'logs/{model_name}_training_history.png', dpi=150)
    print(f"Training history plot saved to logs/{model_name}_training_history.png")
    plt.close()
    
    return model, history_stage1, history_stage2, (rmse, mae)


def main():
    """Main training function."""
    print("="*60)
    print("Beauty Recognition Model Training")
    print("="*60)
    print()
    
    # Check GPU availability
    print(f"TensorFlow version: {tf.__version__}")
    gpus = tf.config.list_physical_devices('GPU')
    print(f"GPU Available: {gpus}")
    print(f"Num GPUs Available: {len(gpus)}")
    print()
    
    # Step 1: Download dataset
    print("Step 1: Downloading SCUT-FBP5500 dataset...")
    download_scut_fbp5500()
    print()
    
    # Step 2: Load full dataset
    print("Step 2: Loading full dataset...")
    X_all, y_all, filenames_all = load_dataset('data/', target_size=(224, 224))
    
    print(f"\nTotal images: {len(X_all)}")
    print(f"Image shape: {X_all[0].shape}")
    print(f"Score range: {y_all.min():.2f} - {y_all.max():.2f}")
    
    stats = get_dataset_statistics(y_all)
    print(f"\nDataset Statistics:")
    for key, value in stats.items():
        print(f"  {key}: {value:.3f}")
    print()
    
    # Step 3: Load male dataset
    print("Step 3: Loading MALE dataset...")
    X_male, y_male, _ = load_dataset('data/', target_size=(224, 224), gender_filter='male')
    y_male = normalize_scores_to_10_scale(y_male, original_range=(y_male.min(), y_male.max()))
    
    print(f"Male images: {len(X_male)}")
    print(f"Male score range: {y_male.min():.2f} - {y_male.max():.2f}")
    print(f"Male score mean: {y_male.mean():.2f}")
    print()
    
    # Step 4: Load female dataset
    print("Step 4: Loading FEMALE dataset...")
    X_female, y_female, _ = load_dataset('data/', target_size=(224, 224), gender_filter='female')
    y_female = normalize_scores_to_10_scale(y_female, original_range=(y_female.min(), y_female.max()))
    
    print(f"Female images: {len(X_female)}")
    print(f"Female score range: {y_female.min():.2f} - {y_female.max():.2f}")
    print(f"Female score mean: {y_female.mean():.2f}")
    print()
    
    # Step 5: Training configuration
    print("Step 5: Setting up training configuration...")
    batch_size = 32
    epochs_stage1 = 30
    epochs_stage2 = 30
    lr_stage1 = 0.001
    lr_stage2 = 0.0001
    
    # Create directories
    os.makedirs('models', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    # Data augmentation
    train_datagen = ImageDataGenerator(
        horizontal_flip=True,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        brightness_range=[0.9, 1.1]
    )
    
    val_test_datagen = ImageDataGenerator()
    print("Configuration ready!")
    print()
    
    # Step 6: Train male model
    print("Step 6: Training MALE model...")
    model_male, hist1_male, hist2_male, metrics_male = train_model(
        X_male, y_male,
        model_name='beauty_model_male',
        gender='male',
        batch_size=batch_size,
        epochs_stage1=epochs_stage1,
        epochs_stage2=epochs_stage2,
        lr_stage1=lr_stage1,
        lr_stage2=lr_stage2,
        train_datagen=train_datagen,
        val_test_datagen=val_test_datagen
    )
    print()
    
    # Step 7: Train female model
    print("Step 7: Training FEMALE model...")
    model_female, hist1_female, hist2_female, metrics_female = train_model(
        X_female, y_female,
        model_name='beauty_model_female',
        gender='female',
        batch_size=batch_size,
        epochs_stage1=epochs_stage1,
        epochs_stage2=epochs_stage2,
        lr_stage1=lr_stage1,
        lr_stage2=lr_stage2,
        train_datagen=train_datagen,
        val_test_datagen=val_test_datagen
    )
    print()
    
    # Step 8: Final results
    print("="*60)
    print("FINAL RESULTS SUMMARY")
    print("="*60)
    print()
    
    print(f"Male Model:")
    print(f"  RMSE: {metrics_male[0]:.4f}")
    print(f"  MAE:  {metrics_male[1]:.4f}")
    print()
    
    print(f"Female Model:")
    print(f"  RMSE: {metrics_female[0]:.4f}")
    print(f"  MAE:  {metrics_female[1]:.4f}")
    print()
    
    print("Models saved to:")
    print("  - models/beauty_model_male.h5")
    print("  - models/beauty_model_female.h5")
    print()
    
    print("="*60)
    print("Training Complete! ✨")
    print("="*60)
    print()
    print("Next steps:")
    print("  1. Run: ./convert_models.sh")
    print("  2. Or manually convert with tensorflowjs_converter")
    print()
    
    print("To convert models to TensorFlow.js format:")
    print("  tensorflowjs_converter --input_format keras models/beauty_model_male.h5 ../public/models/beauty_model_male/")
    print("  tensorflowjs_converter --input_format keras models/beauty_model_female.h5 ../public/models/beauty_model_female/")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nTraining interrupted by user. Exiting...")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError during training: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

