# 🌾 Integrated Farm Management System - Machine Learning Microservice (`ml-service`)

![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-EE4C2C.svg)
![Status](https://img.shields.io/badge/Status-Operational-brightgreen.svg)

`ml-service` is a high-performance RESTful Machine Learning microservice built with **FastAPI**, **PyTorch**, and **Kagglehub**. It powers intelligence across the Integrated Farm Management platform, providing real-time computer vision leaf disease diagnosis, crop suitability recommendation, yield performance forecasting, and fertilizer deficit dosage planning.

---

## 📋 Table of Contents
- [Key Features](#-key-features)
- [Project Directory Structure](#-project-directory-structure)
- [Dataset Architecture & Statistics](#-dataset-architecture--statistics)
- [Getting Started](#-getting-started)
- [Dataset Download & Preparation](#-dataset-download--preparation)
- [REST API Endpoints](#-rest-api-endpoints)
- [Testing](#-testing)
- [Future Roadmap](#-future-roadmap)

---

## ✨ Key Features

1. **Leaf Disease Computer Vision Diagnosis**: Identifies 10 tomato plant health conditions (9 diseases + healthy leaves) with severity rating and actionable agronomic treatment plans.
2. **Crop Suitability Recommendation**: Analyzes soil nutrients ($N, P, K, pH$) and seasonal weather ($temperature, humidity, rainfall$) to recommend optimal crop options.
3. **Yield Performance Forecasting**: Calculates projected crop yield per hectare and total harvest tonnage.
4. **Fertilizer Deficit Recommendation**: Computes exact NPK nutrient deficiencies and outputs customized fertilizer blends, dosage per hectare, and application timing.

---

## 📁 Project Directory Structure

```
ml-service/
│
├── app/
│   ├── __init__.py          # Package initializer
│   ├── main.py              # FastAPI application server & routes
│   ├── schemas.py           # Pydantic data schemas for validation
│   ├── predictor.py         # Agronomic decision-support predictor
│   ├── disease_model.py     # PyTorch leaf disease inference wrapper
│   └── utils.py             # Image pre-processing & formatting helpers
│
├── datasets/
│   ├── raw/
│   │   └── tomato/          # 16,011 raw images organized into 10 target classes
│   └── tomato-disease/
│       ├── train/           # Training dataset split
│       ├── val/             # Validation dataset split
│       └── test/            # Test evaluation dataset split
│
├── models/
│   ├── disease/
│   │   └── best.pt          # PyTorch leaf disease model checkpoint
│   ├── crop/                # Crop recommendation model artifacts
│   └── yield/               # Yield prediction model artifacts
│
├── training/
│   ├── download_and_prepare_tomato.py  # Kagglehub dataset acquisition pipeline
│   ├── train_disease.py               # PyTorch model training script
│   └── evaluate.py                    # Model evaluation & metrics reporting
│
├── tests/
│   ├── test_health.py       # Health check API test suite
│   ├── test_crop.py         # Crop recommendation test suite
│   ├── test_yield.py        # Yield prediction test suite
│   ├── test_fertilizer.py   # Fertilizer dosage test suite
│   └── test_disease.py      # Leaf disease API test suite
│
├── .env                     # Service environment variables
├── .gitignore               # Git ignore pattern rules
├── context.md               # Development progress & execution log
├── README.md                # Project documentation
├── requirements.txt         # Python dependencies manifest
└── run.py                   # Uvicorn server launcher script
```

---

## 📊 Dataset Architecture & Statistics

The tomato leaf disease computer vision dataset is fetched programmatically from Kaggle using `kagglehub` (`emmarex/plantdisease`).

### Extracted Tomato Classes:
| # | Class Name | Extracted Images | Health Condition / Pathogen |
|---|---|---|---|
| 1 | `Tomato_Bacterial_spot` | 2,127 | *Xanthomonas vesicatoria* |
| 2 | `Tomato_Early_blight` | 1,000 | *Alternaria solani* |
| 3 | `Tomato_Late_blight` | 1,909 | *Phytophthora infestans* |
| 4 | `Tomato_Leaf_Mold` | 952 | *Passalora fulva* |
| 5 | `Tomato_Septoria_leaf_spot` | 1,771 | *Septoria lycopersici* |
| 6 | `Tomato_Spider_mites_Two_spotted_spider_mite` | 1,676 | *Tetranychus urticae* |
| 7 | `Tomato_Target_Spot` | 1,404 | *Corynespora cassiicola* |
| 8 | `Tomato_Tomato_mosaic_virus` | 373 | Tomato Mosaic Virus (ToMV) |
| 9 | `Tomato_Tomato_YellowLeaf_Curl_Virus` | 3,208 | Tomato Yellow Leaf Curl Virus (TYLCV) |
| 10 | `Tomato_healthy` | 1,591 | Healthy Foliage |
| **-** | **Total Images** | **16,011** | **10 Classes Verified** |

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.10+
- Virtual Environment tool (`venv`)

### Installation & Setup

1. **Clone the repository & enter directory**:
   ```bash
   cd ml-service
   ```

2. **Create and activate Python virtual environment**:
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install project dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Launch FastAPI Microservice**:
   ```bash
   python run.py
   ```
   The service will run at `http://localhost:8000`. Interactive API documentation is accessible at `http://localhost:8000/docs`.

---

## 📥 Dataset Download & Preparation

To download and extract the Kaggle dataset automatically into `datasets/raw/tomato/`:

```bash
python training/download_and_prepare_tomato.py
```

This script automatically locates `kagglehub`'s cache path, identifies the 10 tomato target directories, copies the image files, and outputs a complete verification report.

---

## 📡 REST API Endpoints

### 1. Health Status
`GET /health`
- **Response**:
  ```json
  {
    "status": "ML Service Operational",
    "modelLoaded": true,
    "engine": "PyTorch / FastAPI"
  }
  ```

### 2. Leaf Disease Prediction
`POST /predict/disease`
- **Request**: `multipart/form-data` with `file` image upload.
- **Response**:
  ```json
  {
    "diseaseName": "Tomato Early Blight (Alternaria solani)",
    "confidence": 94.8,
    "severity": "Moderate",
    "description": "Concentric dark brown leaf spots with surrounding chlorotic yellow halos identified on lower canopy leaves.",
    "recommendedAction": "Apply Copper Hydroxide or Chlorothalonil fungicide spray within 48 hours.",
    "affectedField": "Field A - Tomato Plot"
  }
  ```

### 3. Crop Recommendation
`POST /predict/crop`
- **Request**:
  ```json
  {
    "nitrogen": 45.0,
    "phosphorus": 30.0,
    "potassium": 40.0,
    "pH": 6.5,
    "temperature": 26.5,
    "humidity": 65.0,
    "rainfall": 120.0
  }
  ```

---

## 🧪 Testing

Run pytest across all modular test files:
```bash
pytest
```

---

## 📌 Future Roadmap
- **Dataset Stratification**: Split raw images into Train (80%), Val (10%), and Test (10%).
- **PyTorch Model Fine-tuning**: Train ResNet / MobileNet models on GPU.
- **Model Evaluation**: Generate confusion matrices and classification reports.
