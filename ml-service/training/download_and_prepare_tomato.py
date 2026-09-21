"""
download_and_prepare_tomato.py
------------------------------
Standalone pipeline script to download the Kaggle PlantDisease dataset via kagglehub,
identify the 10 Tomato disease/healthy classes, copy images to datasets/raw/tomato/<class_name>/,
and verify the image dataset completeness.

Compatible with Windows, PowerShell, Linux, and macOS.
"""

import sys
import os
import re
import shutil
from pathlib import Path

# -------------------------------------------------------------------------
# Step 1: Check kagglehub Dependency
# -------------------------------------------------------------------------
try:
    import kagglehub
except ImportError:
    print("[ERROR] kagglehub is not installed!")
    print("Please install it by running the following command:")
    print("    pip install kagglehub")
    sys.exit(1)

# -------------------------------------------------------------------------
# Step 2: Define Configuration & Target Classes
# -------------------------------------------------------------------------
# Target 10 Tomato classes to extract
TARGET_CLASSES = [
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

# Target output directory in project workspace
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DESTINATION_BASE = PROJECT_ROOT / "datasets" / "raw" / "tomato"

def normalize_name(name: str) -> str:
    """
    Normalizes folder names by removing underscores, spaces, hyphens,
    and converting to lowercase for robust fuzzy matching.
    Example: 'Tomato___Bacterial_spot' -> 'tomatobacterialspot'
    """
    return re.sub(r'[^a-zA-Z0-9]', '', name).lower()

def matches_class(folder_name: str, target_class: str) -> bool:
    """
    Checks if a folder name matches a target class name using normalized comparison.
    Handles extra underscores (e.g. Tomato___healthy vs Tomato_healthy) or variations.
    """
    norm_folder = normalize_name(folder_name)
    norm_target = normalize_name(target_class)

    if norm_folder == norm_target:
        return True

    # Handle cases like 'Tomato_YellowLeaf_Curl_Virus' vs 'Tomato_Tomato_YellowLeaf_Curl_Virus'
    if norm_folder.startswith("tomato") and norm_target.startswith("tomato"):
        short_folder = norm_folder.replace("tomato", "", 1)
        short_target = norm_target.replace("tomato", "", 1)
        if short_folder.replace("tomato", "") == short_target.replace("tomato", ""):
            return True

    return False

def download_dataset():
    """
    Downloads the emmarex/plantdisease Kaggle dataset using kagglehub.
    Returns the absolute path to the downloaded files.
    """
    print("=" * 60)
    print("STEP 1: Downloading Kaggle PlantDisease Dataset via kagglehub")
    print("=" * 60)
    try:
        dataset_path = kagglehub.dataset_download("emmarex/plantdisease")
        print(f"[SUCCESS] Dataset downloaded to: {dataset_path}")
        return Path(dataset_path)
    except Exception as e:
        print(f"[CRITICAL ERROR] Failed to download dataset via kagglehub: {e}")
        sys.exit(1)

def find_target_directories(source_root: Path):
    """
    Recursively scans the source directory to locate folders corresponding to
    the 10 target Tomato classes.
    """
    print("\n" + "=" * 60)
    print("STEP 2: Locating 10 Target Tomato Class Folders")
    print("=" * 60)

    found_sources = {}
    
    # Traverse all directories in source_root recursively
    all_directories = [p for p in source_root.rglob("*") if p.is_dir()]

    for target_class in TARGET_CLASSES:
        matching_dir = None
        for directory in all_directories:
            if matches_class(directory.name, target_class):
                # Ensure directory contains at least one supported image
                image_files = [f for f in directory.iterdir() if f.is_file() and f.suffix in SUPPORTED_EXTENSIONS]
                if image_files:
                    matching_dir = directory
                    break
        
        if matching_dir:
            found_sources[target_class] = matching_dir
            print(f"  [FOUND] '{target_class}' -> {matching_dir}")
        else:
            print(f"  [MISSING CLASS] '{target_class}' could not be located in dataset source.")

    return found_sources

def copy_class_images(found_sources: dict):
    """
    Copies image files from source class directories into datasets/raw/tomato/<class_name>/.
    Skips duplicate images if they already exist in the destination.
    """
    print("\n" + "=" * 60)
    print("STEP 3: Copying Images to Destination (datasets/raw/tomato/)")
    print("=" * 60)

    # Ensure root destination directory exists
    DESTINATION_BASE.mkdir(parents=True, exist_ok=True)

    class_image_counts = {}

    for target_class in TARGET_CLASSES:
        dest_dir = DESTINATION_BASE / target_class
        dest_dir.mkdir(parents=True, exist_ok=True)

        if target_class not in found_sources:
            # Count existing images if source missing
            existing_images = [f for f in dest_dir.iterdir() if f.is_file() and f.suffix in SUPPORTED_EXTENSIONS]
            class_image_counts[target_class] = len(existing_images)
            continue

        src_dir = found_sources[target_class]
        source_images = [f for f in src_dir.iterdir() if f.is_file() and f.suffix in SUPPORTED_EXTENSIONS]

        copied_count = 0
        skipped_count = 0

        for img_path in source_images:
            dest_file = dest_dir / img_path.name

            # Avoid re-copying if image file with exact same size already exists
            if dest_file.exists() and dest_file.stat().st_size == img_path.stat().st_size:
                skipped_count += 1
            else:
                try:
                    shutil.copy2(img_path, dest_file)
                    copied_count += 1
                except Exception as e:
                    print(f"  [WARNING] Failed to copy {img_path.name}: {e}")

        total_in_dest = len([f for f in dest_dir.iterdir() if f.is_file() and f.suffix in SUPPORTED_EXTENSIONS])
        class_image_counts[target_class] = total_in_dest
        print(f"  [PROCESSED] {target_class:<45} | Copied: {copied_count:4d} | Skipped/Exist: {skipped_count:4d} | Total: {total_in_dest:4d}")

    return class_image_counts

def verify_and_report(dataset_source: Path, class_counts: dict, missing_classes: list):
    """
    Prints a clean summary verification report of the prepared tomato dataset.
    Exits with error code 1 if any target class is missing or empty.
    """
    total_images = sum(class_counts.values())
    found_count = len(TARGET_CLASSES) - len(missing_classes)

    print("\n" + "=" * 60)
    print("TOMATO DATASET PREPARATION REPORT")
    print("=" * 60)
    print(f"\nDataset source:\n{dataset_source}\n")
    print(f"Classes found: {found_count} / {len(TARGET_CLASSES)}\n")

    for cls in TARGET_CLASSES:
        count = class_counts.get(cls, 0)
        status = f"{count:6d} images" if count > 0 else "MISSING / EMPTY"
        print(f"  {cls:<45} : {status}")

    print(f"\nTotal tomato images: {total_images:,}")
    print(f"\nDestination:\n{DESTINATION_BASE}")
    print("\n" + "=" * 60)

    if missing_classes or any(count == 0 for count in class_counts.values()):
        print("\n[FAILURE] The following target classes are missing or contain 0 images:")
        for mc in missing_classes:
            print(f"  - {mc}")
        print("\nDataset preparation FAILED.")
        sys.exit(1)
    else:
        print("DATASET PREPARATION COMPLETED SUCCESSFULLY!")
        print("=" * 60)

def main():
    # 1. Download Kaggle dataset via kagglehub
    dataset_source = download_dataset()

    # 2. Locate target class folders
    found_sources = find_target_directories(dataset_source)

    # 3. Identify any missing classes
    missing_classes = [c for c in TARGET_CLASSES if c not in found_sources]

    # 4. Copy images to target workspace
    class_counts = copy_class_images(found_sources)

    # 5. Print verification report & validate completion
    verify_and_report(dataset_source, class_counts, missing_classes)

if __name__ == "__main__":
    main()
