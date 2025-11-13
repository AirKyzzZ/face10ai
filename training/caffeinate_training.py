#!/usr/bin/env python3
"""
Python wrapper that prevents Mac from sleeping during training.
This script uses caffeinate through subprocess to keep Mac awake.
"""

import subprocess
import sys
import os

def main():
    """Run training with caffeinate to prevent sleep."""
    
    print("="*60)
    print("Beauty Recognition Model Training")
    print("WITH NO SLEEP MODE ENABLED")
    print("="*60)
    print()
    print("⚠️  IMPORTANT:")
    print("   - Mac will NOT sleep while training is running")
    print("   - Screen will stay on")
    print("   - Press Ctrl+C to stop training and allow sleep")
    print()
    
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    train_script = os.path.join(script_dir, 'train.py')
    
    # Check if train.py exists
    if not os.path.exists(train_script):
        print(f"Error: train.py not found at {train_script}")
        sys.exit(1)
    
    # Prepare caffeinate command
    # -d: prevent display from sleeping
    # -i: prevent system from idle sleeping
    # -m: prevent disk from sleeping
    # -s: prevent system from sleeping (only when plugged in)
    caffeinate_cmd = [
        'caffeinate',
        '-dims',  # Display, Idle, Disk, System sleep prevention
        sys.executable,  # Use the same Python interpreter
        train_script
    ]
    
    print("Starting training with caffeinate...")
    print("="*60)
    print()
    
    try:
        # Run training with caffeinate
        subprocess.run(caffeinate_cmd, check=True)
        
        print()
        print("="*60)
        print("Training complete!")
        print("Mac will resume normal sleep behavior.")
        print("="*60)
        
    except KeyboardInterrupt:
        print()
        print()
        print("⚠️  Training interrupted by user.")
        print("Mac will resume normal sleep behavior.")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print()
        print(f"❌ Training failed with error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

