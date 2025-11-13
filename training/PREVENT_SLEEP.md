# 💤 Prevent Mac from Sleeping During Training

## Quick Solution: Use the No-Sleep Script

I've created a script that automatically prevents your Mac from sleeping during training:

```bash
cd training
./run_training_no_sleep.sh
```

This script uses macOS's `caffeinate` command to:
- ✅ Prevent display from sleeping
- ✅ Prevent system from idle sleeping  
- ✅ Prevent disk from sleeping
- ✅ Keep screen awake
- ✅ Works when plugged in

## What the Script Does

The script runs training with `caffeinate` which prevents sleep:
```bash
caffeinate -dims python train.py
```

**Flags explained:**
- `-d`: Prevent display from sleeping (screen stays on)
- `-i`: Prevent system from idle sleeping
- `-m`: Prevent disk from sleeping
- `-s`: Prevent system from sleeping (only when plugged in)

## Alternative: Manual Methods

### Method 1: System Settings (Permanent)

1. **Open System Settings** (or System Preferences on older macOS)
2. **Go to "Battery"** (or "Energy Saver")
3. **Set "Turn display off after"** to "Never" (when plugged in)
4. **Uncheck "Prevent automatic sleeping when display is off"** (if present)
5. **Set "Put hard disks to sleep when possible"** to OFF

### Method 2: Terminal Command (Temporary)

Run this before training:
```bash
# Prevent sleep until you press Ctrl+C
caffeinate -dims

# In another terminal, run training:
cd training
source venv/bin/activate
python train.py
```

### Method 3: Terminal Command (For Specific Duration)

```bash
# Prevent sleep for 4 hours (14400 seconds)
caffeinate -dims -t 14400 python train.py
```

### Method 4: Create a Custom Script

Create `prevent_sleep.sh`:
```bash
#!/bin/bash
caffeinate -dims -t 14400 bash -c "cd training && source venv/bin/activate && python train.py"
```

Make it executable:
```bash
chmod +x prevent_sleep.sh
./prevent_sleep.sh
```

## Verify It's Working

### Check if Caffeinate is Running

```bash
# Check running caffeinate processes
ps aux | grep caffeinate
```

You should see a caffeinate process running.

### Test Sleep Prevention

1. Start training with the no-sleep script
2. Wait a few minutes
3. Check if Mac stays awake (screen doesn't dim, doesn't sleep)
4. If it still sleeps, see troubleshooting below

## Troubleshooting

### Mac Still Goes to Sleep

**Try these fixes:**

1. **Check power settings:**
   ```bash
   # View current settings
   pmset -g
   ```

2. **Override system sleep settings:**
   ```bash
   # Prevent sleep (requires admin password)
   sudo pmset -a sleep 0
   sudo pmset -a displaysleep 0
   ```

   **After training, restore:**
   ```bash
   sudo pmset -a sleep 10
   sudo pmset -a displaysleep 10
   ```

3. **Use stronger caffeinate flags:**
   ```bash
   # Most aggressive (prevents ALL sleep)
   caffeinate -d -i -m -s -u python train.py
   ```

4. **Check if Mac is actually plugged in:**
   - Caffeinate `-s` flag only works when plugged in
   - Verify power adapter is connected

### Screen Still Dims

**Fix:**
```bash
# Keep display fully awake (no dimming)
caffeinate -d -i -m -s -u -t 14400 python train.py
```

### Training Interrupted

**Solution:** Run training in background with nohup:
```bash
cd training
nohup ./run_training_no_sleep.sh > training.log 2>&1 &
```

Then check progress:
```bash
tail -f training.log
```

## Recommended Approach

### For Training Now:

**Just use the script:**
```bash
cd training
./run_training_no_sleep.sh
```

### For Long Training Sessions:

1. **Use the no-sleep script** (simplest)
2. **OR set system settings** to "Never" sleep when plugged in
3. **Monitor progress** by checking the terminal output

## Additional Tips

### Keep Terminal Visible

- Keep Terminal app open and visible
- Don't close the terminal window
- Don't log out

### Check Training Progress

Training will show progress in terminal:
```
Epoch 1/30
125/125 [==============================] - 45s 360ms/step - loss: 2.3456
...
```

### If Training Stops

1. **Check if it was interrupted:** Look for "KeyboardInterrupt" or error
2. **Check logs:** See `logs/` directory for saved models
3. **Resume if needed:** Training saves checkpoints automatically

## Summary

**Easiest Solution:**
```bash
cd training
./run_training_no_sleep.sh
```

**What it does:**
- ✅ Prevents sleep during training
- ✅ Keeps screen awake
- ✅ Works automatically
- ✅ Stops when training completes

**Manual Alternative:**
```bash
caffeinate -dims python train.py
```

---

**Your Mac will stay awake for the entire training session!** 🎉

