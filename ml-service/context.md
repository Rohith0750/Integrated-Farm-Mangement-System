# Machine Learning Service - Context & Progress Log (`context.md`)

## 📌 Project Overview
`ml-service` is a standalone, FastAPI-powered Machine Learning microservice designed for the **Integrated Farm Management System**. Its primary responsibilities include:
1. **Plant Leaf Disease Diagnosis**: Computer vision classification for tomato leaf diseases.
2. **Crop Recommendation Engine**: Soil-nutrient (NPK, pH) and climate-based crop suitability matching.
3. **Yield Performance Forecasting**: Estimating harvest tonnage per hectare based on soil and environmental inputs.
4. **Fertilizer Dosage Calculation**: Recommending optimal NPK fertilizer split applications to address soil nutrient deficits.

---

## 🕒 Work Completed So Far

### 1. Repository & Architecture Restructuring
The microservice directory structure was standardized to separate API endpoints, machine learning models, dataset storage, training scripts, and automated unit tests.

### 2. Kaggle Dataset Download & Extraction Pipeline
- Integrated `kagglehub` library to programmatically fetch the Kaggle `emmarex/plantdisease` dataset.
- Developed [`training/download_and_prepare_tomato.py`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/ml-service/training/download_and_prepare_tomato.py) with flexible folder matching logic to isolate and extract only the 10 Tomato plant classes.
- Downloaded and extracted **16,011 high-resolution images** into `datasets/raw/tomato/`.

### 3. Stratified Dataset Splitting (70% Train / 20% Val / 10% Test)
- Developed [`training/split_dataset.py`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/ml-service/training/split_dataset.py) using random seed 42 for 100% reproducible splits.
- Split all 10 tomato classes into `datasets/tomato/train/`, `datasets/tomato/val/`, and `datasets/tomato/test/`.

### 4. Dataset Integrity Verification
- Developed and executed [`training/verify_dataset.py`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/ml-service/training/verify_dataset.py) to audit dataset structure.
- **Verification Status**: `DATASET VERIFICATION PASSED` (10/10 classes verified across train, val, and test splits).

#### Summary Table of Dataset Verification:
| Class Name | Train (70%) | Validation (20%) | Test (10%) | Total Images |
|---|---|---|---|---|
| `Tomato_Bacterial_spot` | 1,489 | 425 | 213 | 2,127 |
| `Tomato_Early_blight` | 700 | 200 | 100 | 1,000 |
| `Tomato_Late_blight` | 1,336 | 382 | 191 | 1,909 |
| `Tomato_Leaf_Mold` | 666 | 190 | 96 | 952 |
| `Tomato_Septoria_leaf_spot` | 1,240 | 354 | 177 | 1,771 |
| `Tomato_Spider_mites_Two_spotted_spider_mite` | 1,173 | 335 | 168 | 1,676 |
| `Tomato_Target_Spot` | 983 | 281 | 140 | 1,404 |
| `Tomato_Tomato_mosaic_virus` | 261 | 75 | 37 | 373 |
| `Tomato_Tomato_YellowLeaf_Curl_Virus` | 2,246 | 642 | 320 | 3,208 |
| `Tomato_healthy` | 1,114 | 318 | 159 | 1,591 |
| **TOTAL** | **11,208 (70.00%)** | **3,202 (20.00%)** | **1,601 (10.00%)** | **16,011 (100%)** |

### 5. FastAPI Endpoints & Schemas
- Created [`app/schemas.py`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/ml-service/app/schemas.py) for strongly-typed request/response validation using Pydantic.
- Created [`app/disease_model.py`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/ml-service/app/disease_model.py) for leaf disease model loading and inference logic.
- Implemented API endpoints in [`app/main.py`](file:///c:/Users/Rohith%20S%20D/OneDrive/Documents/Farm%20Management/ml-service/app/main.py).

---

## 🗺️ Roadmap: What Will Happen Next

```
[Completed]                        [Completed]                      [Completed]                      [Upcoming Step 1]                [Upcoming Step 2]
16,011 Raw Images         --->     Dataset Splitting         --->   Dataset Verification      --->   Model Training            --->   Model Evaluation & API Integration
(datasets/raw/tomato/)            (70% / 20% / 10%)               (verify_dataset.py)              (PyTorch / torchvision)            (models/disease/best.pt)
```
