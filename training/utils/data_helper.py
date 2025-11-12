"""
Data Helper Utilities for Beauty Recognition Model Training

This module provides utilities for downloading, processing, and preparing
facial beauty datasets for model training.
"""

import os
import shutil
import zipfile
from typing import Dict, Tuple, List
import gdown
import cv2
import numpy as np
from sklearn.model_selection import train_test_split


# Dataset configurations
SCUT_FBP5500_URL = 'https://drive.google.com/uc?id=1w0TorBfTIqbquQVd6k3h_77ypnrvfGwf'
DATA_DIR = 'data/'
LABELS_FILE = 'All_labels.txt'


def download_scut_fbp5500(data_dir: str = DATA_DIR) -> None:
    """
    Download and extract the SCUT-FBP5500 dataset.
    
    Args:
        data_dir: Directory to store the extracted data
    """
    zip_file = 'SCUT-FBP5500_v2.1.zip'
    
    # Check if already downloaded
    if os.path.isfile(os.path.join(data_dir, LABELS_FILE)):
        print('SCUT-FBP5500 dataset already downloaded and extracted.')
        return
    
    # Download dataset
    if not os.path.isfile(zip_file):
        print('Downloading SCUT-FBP5500 dataset...')
        gdown.download(SCUT_FBP5500_URL, zip_file, quiet=False)
    else:
        print('Dataset zip file already exists.')
    
    # Extract dataset
    print('Extracting dataset...')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
    
    extract_zipfile(zip_file, data_dir)
    
    # Clean up zip file
    if os.path.exists(zip_file):
        os.remove(zip_file)
    
    print('SCUT-FBP5500 dataset ready!')


def extract_zipfile(zip_path: str, target_dir: str) -> None:
    """
    Extract specific files from zip archive (images and labels only).
    
    Args:
        zip_path: Path to the zip file
        target_dir: Directory to extract files to
    """
    with zipfile.ZipFile(zip_path) as zip_file:
        for member in zip_file.namelist():
            filename = os.path.basename(member)
            # Only extract .jpg images and the labels file
            if filename.endswith('.jpg') or filename == LABELS_FILE:
                source = zip_file.open(member)
                target = open(os.path.join(target_dir, filename), 'wb')
                with source, target:
                    shutil.copyfileobj(source, target)


def load_scut_labels(data_dir: str = DATA_DIR) -> Dict[str, float]:
    """
    Load image labels from the SCUT-FBP5500 label file.
    
    Args:
        data_dir: Directory containing the labels file
    
    Returns:
        Dictionary mapping image filenames to beauty scores
    """
    labels_dict = {}
    labels_path = os.path.join(data_dir, LABELS_FILE)
    
    with open(labels_path, 'r') as fp:
        for line in fp:
            # Each line: "image_name.jpg score"
            parts = line.strip().split()
            if len(parts) >= 2:
                img_name = parts[0]
                score = float(parts[1])
                labels_dict[img_name] = score
    
    print(f'Loaded {len(labels_dict)} image labels')
    return labels_dict


def get_gender_from_filename(filename: str) -> str:
    """
    Extract gender from SCUT-FBP5500 filename.
    CF = female, CM = male
    
    Args:
        filename: Image filename (e.g., 'CF001.jpg' or 'CM001.jpg')
    
    Returns:
        'female' or 'male'
    """
    if filename.startswith('CF'):
        return 'female'
    elif filename.startswith('CM'):
        return 'male'
    else:
        # Default to female for unknown
        return 'female'


def preprocess_image(image: np.ndarray, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Preprocess image for model input.
    
    Args:
        image: Input image (BGR format from cv2)
        target_size: Target size for the image
    
    Returns:
        Preprocessed image (RGB, resized, normalized)
    """
    # Convert BGR to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # Resize
    image = cv2.resize(image, target_size)
    # Normalize to [0, 1]
    image = image.astype(np.float32) / 255.0
    return image


def load_dataset(
    data_dir: str = DATA_DIR,
    target_size: Tuple[int, int] = (224, 224),
    gender_filter: str = None
) -> Tuple[np.ndarray, np.ndarray, List[str]]:
    """
    Load all images and labels from the dataset.
    
    Args:
        data_dir: Directory containing the images
        target_size: Target size for images
        gender_filter: Optional filter ('male' or 'female')
    
    Returns:
        Tuple of (images, labels, filenames)
    """
    labels_dict = load_scut_labels(data_dir)
    
    images = []
    labels = []
    filenames = []
    
    print(f'Loading images from {data_dir}...')
    
    for filename, score in labels_dict.items():
        # Apply gender filter if specified
        if gender_filter:
            gender = get_gender_from_filename(filename)
            if gender != gender_filter:
                continue
        
        img_path = os.path.join(data_dir, filename)
        if not os.path.exists(img_path):
            continue
        
        # Load and preprocess image
        img = cv2.imread(img_path)
        if img is None:
            print(f'Warning: Could not load {filename}')
            continue
        
        img = preprocess_image(img, target_size)
        
        images.append(img)
        labels.append(score)
        filenames.append(filename)
    
    images = np.array(images)
    labels = np.array(labels)
    
    print(f'Loaded {len(images)} images')
    if gender_filter:
        print(f'Gender filter: {gender_filter}')
    
    return images, labels, filenames


def split_dataset(
    X: np.ndarray,
    y: np.ndarray,
    test_size: float = 0.3,
    val_size: float = 0.2,
    random_state: int = 42
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Split dataset into train, validation, and test sets.
    
    Args:
        X: Input images
        y: Labels
        test_size: Proportion for test set (from total)
        val_size: Proportion for validation set (from remaining)
        random_state: Random seed for reproducibility
    
    Returns:
        Tuple of (X_train, X_val, X_test, y_train, y_val, y_test)
    """
    # First split: separate test set
    X_temp, X_test, y_temp, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    
    # Second split: separate validation from training
    val_ratio = val_size / (1 - test_size)
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=val_ratio, random_state=random_state
    )
    
    print(f'Dataset split:')
    print(f'  Training: {len(X_train)} samples')
    print(f'  Validation: {len(X_val)} samples')
    print(f'  Test: {len(X_test)} samples')
    
    return X_train, X_val, X_test, y_train, y_val, y_test


def normalize_scores_to_10_scale(scores: np.ndarray, original_range: Tuple[float, float] = (1, 5)) -> np.ndarray:
    """
    Normalize beauty scores to 0-10 scale.
    
    Args:
        scores: Original scores
        original_range: Original score range (min, max)
    
    Returns:
        Scores normalized to 0-10 scale
    """
    min_score, max_score = original_range
    # Linear normalization to 0-10
    normalized = (scores - min_score) / (max_score - min_score) * 10
    return normalized


def get_dataset_statistics(labels: np.ndarray) -> Dict:
    """
    Calculate statistics for the dataset.
    
    Args:
        labels: Array of beauty scores
    
    Returns:
        Dictionary with statistics
    """
    stats = {
        'count': len(labels),
        'mean': np.mean(labels),
        'std': np.std(labels),
        'min': np.min(labels),
        'max': np.max(labels),
        'median': np.median(labels)
    }
    return stats

