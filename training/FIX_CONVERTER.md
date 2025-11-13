# 🔧 Fix: tensorflowjs_converter Not Found

## The Problem

```
zsh: command not found: tensorflowjs_converter
```

**Cause:** The virtual environment wasn't activated, so the converter wasn't in PATH.

## ✅ Solution: Use the Updated Script

I've updated `convert_models.sh` to automatically activate the virtual environment. Just run:

```bash
cd training
./convert_models.sh
```

The script now:
- ✅ Automatically activates venv
- ✅ Uses the converter from venv
- ✅ Works without manual activation

## Alternative: Manual Conversion

If you prefer to convert manually:

```bash
cd training
source venv/bin/activate  # Activate venv first!
./convert_models.sh       # Or run the commands below
```

### Or use Python module directly:

```bash
cd training
source venv/bin/activate

# Convert male model
python -m tensorflowjs.converters.convert \
    --input_format keras \
    --quantize_uint8 \
    models/beauty_model_male.h5 \
    ../public/models/beauty_model_male/

# Convert female model
python -m tensorflowjs.converters.convert \
    --input_format keras \
    --quantize_uint8 \
    models/beauty_model_female.h5 \
    ../public/models/beauty_model_female/
```

## Verify Installation

Check if converter is available:

```bash
cd training
source venv/bin/activate
which tensorflowjs_converter
```

Should show: `/path/to/training/venv/bin/tensorflowjs_converter`

## If Still Not Found

### Reinstall tensorflowjs:

```bash
cd training
source venv/bin/activate
pip install --upgrade tensorflowjs
```

### Or install in venv:

```bash
cd training
source venv/bin/activate
pip install -r requirements-simple.txt
```

This will install tensorflowjs in the venv.

## Summary

**Easiest fix:**
```bash
cd training
./convert_models.sh  # Now automatically activates venv!
```

**Manual fix:**
```bash
cd training
source venv/bin/activate  # Activate venv first!
./convert_models.sh
```

**Python module (always works):**
```bash
cd training
source venv/bin/activate
python -m tensorflowjs.converters.convert --input_format keras models/beauty_model_male.h5 ../public/models/beauty_model_male/
```

---

**The script is now fixed and will work automatically!** 🎉

