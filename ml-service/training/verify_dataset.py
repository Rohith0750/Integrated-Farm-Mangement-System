"""
verify_dataset.py
-----------------
Verification script for the Tomato Leaf Disease dataset located in datasets/tomato/.
Validates that all 10 expected classes exist in train, val, and test splits,
counts images per split, verifies percentages, and ensures dataset integrity without mutating files.
"""

import sys
import os
from pathlib import Path

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

# Supported image file extensions (case-insensitive)
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

# Dataset path configuration
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATASET_DIR = PROJECT_ROOT / "datasets" / "tomato"

def verify_dataset():
    """
    Verifies train, val, and test splits for the 10 tomato leaf disease classes.
    """
    print("=" * 80)
    print("               TOMATO DISEASE DATASET VERIFICATION REPORT               ")
    print("=" * 80)
    print(f"Dataset Path: {DATASET_DIR}\n")

    if not DATASET_DIR.exists():
        print(f"[ERROR] Dataset directory not found at: {DATASET_DIR}")
        print("\n===============================================================================")
        print("DATASET VERIFICATION FAILED")
        print("===============================================================================")
        sys.exit(1)

    splits = ["train", "val", "test"]
    errors = []

    # Check split directories exist
    for split in splits:
        split_path = DATASET_DIR / split
        if not split_path.exists() or not split_path.is_dir():
            errors.append(f"Missing split directory: '{split}' ({split_path})")

    if errors:
        for err in errors:
            print(f"[ERROR] {err}")
        print("\n===============================================================================")
        print("DATASET VERIFICATION FAILED")
        print("===============================================================================")
        sys.exit(1)

    class_counts = {cls: {"train": 0, "val": 0, "test": 0, "total": 0} for cls in EXPECTED_CLASSES}
    missing_classes = []
    empty_classes = []

    for cls in EXPECTED_CLASSES:
        for split in splits:
            cls_split_dir = DATASET_DIR / split / cls
            if not cls_split_dir.exists() or not cls_split_dir.is_dir():
                missing_classes.append(f"{split}/{cls}")
                continue

            # Count image files recursively matching supported extensions
            images = [
                f for f in cls_split_dir.iterdir()
                if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS
            ]
            count = len(images)
            if count == 0:
                empty_classes.append(f"{split}/{cls}")

            class_counts[cls][split] = count
            class_counts[cls]["total"] += count

    # Print Table Header
    print(f"{'Class Name':<45} | {'Train':^9} | {'Val':^9} | {'Test':^9} | {'Total':^9}")
    print("-" * 84)

    total_train = 0
    total_val = 0
    total_test = 0

    for cls in EXPECTED_CLASSES:
        tr = class_counts[cls]["train"]
        va = class_counts[cls]["val"]
        te = class_counts[cls]["test"]
        tot = class_counts[cls]["total"]

        total_train += tr
        total_val += va
        total_test += te

        print(f"{cls:<45} | {tr:^9d} | {va:^9d} | {te:^9d} | {tot:^9d}")

    total_all = total_train + total_val + total_test

    print("-" * 84)
    print(f"{'TOTAL IMAGES':<45} | {total_train:^9d} | {total_val:^9d} | {total_test:^9d} | {total_all:^9d}")

    if total_all > 0:
        pct_train = (total_train / total_all) * 100
        pct_val = (total_val / total_all) * 100
        pct_test = (total_test / total_all) * 100
        print(f"{'PERCENTAGE SPLIT':<45} | {pct_train:^8.2f}% | {pct_val:^8.2f}% | {pct_test:^8.2f}% | 100.00%")

    print("=" * 84)

    # Check for errors
    if missing_classes:
        print("\n[ERROR] Missing Class Directories:")
        for mc in missing_classes:
            print(f"  - {mc}")

    if empty_classes:
        print("\n[ERROR] Empty Class Directories (0 images found):")
        for ec in empty_classes:
            print(f"  - {ec}")

    has_failed = bool(missing_classes or empty_classes or total_all == 0)

    print("\nVERIFICATION RESULTS:")
    print(f"  - Expected Classes Present : {len(EXPECTED_CLASSES) - len(set([c.split('/')[-1] for c in missing_classes]))} / {len(EXPECTED_CLASSES)}")
    print(f"  - Total Images Verified   : {total_all:,}")
    print(f"  - Train Split             : {total_train:,} images ({pct_train if total_all > 0 else 0:.2f}%)")
    print(f"  - Validation Split        : {total_val:,} images ({pct_val if total_all > 0 else 0:.2f}%)")
    print(f"  - Test Split              : {total_test:,} images ({pct_test if total_all > 0 else 0:.2f}%)")

    print("\n" + "=" * 84)
    if has_failed:
        print("DATASET VERIFICATION FAILED")
        print("=" * 84)
        sys.exit(1)
    else:
        print("DATASET VERIFICATION PASSED")
        print("=" * 84)

if __name__ == "__main__":
    verify_dataset()
