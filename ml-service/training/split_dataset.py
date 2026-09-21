"""
split_dataset.py
----------------
Splits the 10 raw Tomato leaf disease image classes from:
    datasets/raw/tomato/
into reproducible Train (70%), Validation (20%), and Test (10%) splits under:
    datasets/tomato/
        ├── train/
        ├── val/
        └── test/

Key Features:
- Fixed Random Seed (42) for 100% reproducible splits.
- Preserves exact class distribution across splits.
- Copies files safely without mutating raw dataset source.
- Avoids duplicate file copies if executed multiple times.
"""

import sys
import os
import random
import shutil
from pathlib import Path

# Set fixed random seed for reproducibility
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

# Split ratios: 70% train, 20% validation, 10% test
TRAIN_RATIO = 0.70
VAL_RATIO = 0.20
TEST_RATIO = 0.10

# Target 10 Tomato classes
EXPECTED_CLASSES = [
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato_Target_Spot",
    "Tomato_Tomato_mosaic_virus",
    "Tomato_Tomato_YellowLeaf_Curl_Virus",
    "Tomato_healthy",
]

# Supported image file extensions
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp", ".JPG", ".JPEG", ".PNG"}

# Paths setup
PROJECT_ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = PROJECT_ROOT / "datasets" / "raw" / "tomato"
OUTPUT_BASE_DIR = PROJECT_ROOT / "datasets" / "tomato"

def validate_raw_dataset():
    """
    Validates that datasets/raw/tomato exists and contains all 10 expected classes with images.
    """
    if not RAW_DIR.exists():
        print(f"[ERROR] Raw dataset directory does not exist at: {RAW_DIR}")
        sys.exit(1)

    found_classes = {}
    missing_classes = []

    for cls_name in EXPECTED_CLASSES:
        cls_dir = RAW_DIR / cls_name
        if not cls_dir.exists() or not cls_dir.is_dir():
            missing_classes.append(cls_name)
            continue

        images = [f for f in cls_dir.iterdir() if f.is_file() and f.suffix in SUPPORTED_EXTENSIONS]
        if len(images) == 0:
            print(f"[ERROR] Class '{cls_name}' was found but contains 0 images.")
            sys.exit(1)

        found_classes[cls_name] = images

    if missing_classes:
        print(f"[ERROR] Missing {len(missing_classes)} required class folder(s):")
        for mc in missing_classes:
            print(f"  - {mc}")
        sys.exit(1)

    return found_classes

def create_output_directories():
    """
    Creates destination directories for train, val, and test splits for all 10 classes.
    Structure:
        datasets/tomato/train/<class_name>
        datasets/tomato/val/<class_name>
        datasets/tomato/test/<class_name>
    """
    splits = ["train", "val", "test"]
    for split in splits:
        for cls_name in EXPECTED_CLASSES:
            split_cls_dir = OUTPUT_BASE_DIR / split / cls_name
            split_cls_dir.mkdir(parents=True, exist_ok=True)

def copy_files(file_list, target_dir):
    """
    Copies a list of files to target_dir safely.
    Skips copying if exact file already exists with matching byte size.
    """
    copied_count = 0
    for file_path in file_list:
        dest_path = target_dir / file_path.name
        if dest_path.exists() and dest_path.stat().st_size == file_path.stat().st_size:
            continue
        shutil.copy2(file_path, dest_path)
        copied_count += 1
    return copied_count

def perform_dataset_split(raw_images_dict):
    """
    Splits images per class 70/20/10 and copies them into train, val, and test folders.
    """
    print("=" * 65)
    print("STARTING DATASET SPLITTING (70% Train | 20% Val | 10% Test)")
    print("=" * 65)

    stats = {}
    total_train = 0
    total_val = 0
    total_test = 0

    for cls_name, images in raw_images_dict.items():
        # Shuffle images randomly using fixed seed 42
        shuffled_images = images.copy()
        random.shuffle(shuffled_images)

        total_count = len(shuffled_images)

        # Calculate exact split boundaries
        n_train = int(round(total_count * TRAIN_RATIO))
        n_val = int(round(total_count * VAL_RATIO))
        n_test = total_count - n_train - n_val

        train_files = shuffled_images[:n_train]
        val_files = shuffled_images[n_train:n_train + n_val]
        test_files = shuffled_images[n_train + n_val:]

        # Copy files to respective split directories
        copy_files(train_files, OUTPUT_BASE_DIR / "train" / cls_name)
        copy_files(val_files, OUTPUT_BASE_DIR / "val" / cls_name)
        copy_files(test_files, OUTPUT_BASE_DIR / "test" / cls_name)

        stats[cls_name] = {
            "total": total_count,
            "train": len(train_files),
            "val": len(val_files),
            "test": len(test_files)
        }

        total_train += len(train_files)
        total_val += len(val_files)
        total_test += len(test_files)

        print(f"Class: {cls_name}")
        print(f"  Total: {total_count:<5} | Train: {len(train_files):<5} | Validation: {len(val_files):<5} | Test: {len(test_files):<5}")
        print("-" * 65)

    return stats, total_train, total_val, total_test

def verify_dataset_structure():
    """
    Verifies that every single class exists and is non-empty across train, val, and test splits.
    """
    splits = ["train", "val", "test"]
    for split in splits:
        for cls_name in EXPECTED_CLASSES:
            cls_dir = OUTPUT_BASE_DIR / split / cls_name
            if not cls_dir.exists():
                print(f"[VERIFICATION ERROR] Missing directory: {cls_dir}")
                return False
            count = len([f for f in cls_dir.iterdir() if f.is_file() and f.suffix in SUPPORTED_EXTENSIONS])
            if count == 0:
                print(f"[VERIFICATION ERROR] Directory is empty: {cls_dir}")
                return False
    return True

def main():
    # Step 1: Validate input raw dataset
    raw_images_dict = validate_raw_dataset()

    # Step 2: Create output destination folders
    create_output_directories()

    # Step 3: Perform 70/20/10 split & copy files
    stats, total_train, total_val, total_test = perform_dataset_split(raw_images_dict)

    # Step 4: Verify complete output dataset integrity
    is_verified = verify_dataset_structure()

    total_images_all = total_train + total_val + total_test

    print("\n" + "=" * 65)
    print("DATASET SPLIT SUMMARY REPORT")
    print("=" * 65)
    print(f"Number of classes        : {len(stats)} / {len(EXPECTED_CLASSES)}")
    print(f"Total raw images         : {total_images_all:,}")
    print(f"Total train images (70%) : {total_train:,}")
    print(f"Total val images (20%)   : {total_val:,}")
    print(f"Total test images (10%)  : {total_test:,}")
    print(f"Verification Check       : {'PASSED (10/10 classes present in all splits)' if is_verified else 'FAILED'}")
    print("=" * 65)

    if not is_verified:
        print("[CRITICAL] Split verification failed!")
        sys.exit(1)
    else:
        print("DATASET SPLITTING COMPLETED SUCCESSFULLY!")
        print("Output location: datasets/tomato/")
        print("=" * 65)

if __name__ == "__main__":
    main()
