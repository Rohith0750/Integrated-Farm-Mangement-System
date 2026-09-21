# Integrated Farm Management System (PRJ_533)
## Comprehensive Project Overview & Detailed Technical Progress Log

---

## 1. Executive Summary & Project Vision

**PRJ_533 - Integrated Farm Management System** is a full-stack, enterprise-grade agricultural decision support and resource management platform. Designed for modern farmers, farm managers, and agricultural enterprise administrators, the system unifies operational farm management, IoT/soil telemetry, microclimate weather tracking, financial accounting, labor management, and machine-learning-driven agronomic intelligence into a centralized dashboard.

### Core Objectives:
1. **Centralized Operational Management**: Manage multi-location farms, fields (GIS mapping), crop cycles, inventory stock, workers, and financial ledgers.
2. **Precision Agriculture Telemetry**: Capture and analyze real-time soil NPK (Nitrogen, Phosphorus, Potassium), pH, moisture, and microclimate weather metrics.
3. **Data-Driven Decision Support**: Deliver explainable AI recommendations for crop selection, fertilizer application, irrigation scheduling, harvest timing, and crop disease diagnosis.
4. **End-to-End Enterprise Microservices Architecture**: Decouple visual UI, business logic REST APIs, and high-performance ML inference engines.

---

## 2. System Architecture & Tech Stack

The system is engineered as a modern multi-tier microservices architecture:

```
                  ┌─────────────────────────────────────────┐
                  │    React 19 + TypeScript Frontend       │
                  │  (Vite, Tailwind CSS v4, Google Maps)   │
                  └────────────────────┬────────────────────┘
                                       │ HTTP / REST / JWT
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │        Node.js + Express REST API       │
                  │   (Controllers, Services, Auth Middleware)│
                  └──────────┬──────────────────┬───────────┘
                             │                  │
               MongoDB Atlas │                  │ HTTP / FastAPI Proxy
                             ▼                  ▼
                  ┌────────────────────┐   ┌───────────────────────────┐
                  │   MongoDB Atlas    │   │  Python FastAPI ML Engine │
                  │  (Document Store)  │   │  (Scikit-Learn, PyTorch)  │
                  └────────────────────┘   └───────────────────────────┘
```

### Technology Stack Matrix

| Tier | Component / Technology | Primary Purpose & Usage |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19, TypeScript, Vite** | Single-page application rendering, strict type checking, fast Vite HMR bundling. |
| **Styling & UI** | **Tailwind CSS v4, Lucide Icons** | Glassmorphic & responsive aesthetic UI components, stat cards, dynamic badges. |
| **Mapping & GIS**| **Google Maps API, Places Autocomplete** | Field boundary visualization, geolocation, reverse geocoding, info cards. |
| **Charts & Data**| **Recharts** | Interactive soil telemetry trend analysis, yield distributions, financial breakdown. |
| **Backend API** | **Node.js, Express.js** | Modular REST API routing, business rule validation, controller/service separation. |
| **Database** | **MongoDB Atlas (Mongoose ORM)** | Document database storing users, farms, fields, crops, soil logs, inventory, finance. |
| **Auth & Access**| **JWT, HttpOnly Cookies, Bcryptjs** | Secure stateless session authentication, password hashing, Role-Based Access Control. |
| **ML Engine** | **Python 3.11+, FastAPI, Uvicorn**| Microservice running ML inference for crop recommendations, yield & disease CV. |
| **ML Models** | **Scikit-learn, XGBoost, PyTorch/YOLO** | Decision tree crop selector, yield forecasting regressor, CNN/YOLO leaf disease vision. |
| **Weather API** | **Open-Meteo & OpenWeatherMap** | Live microclimate weather telemetry (temp, humidity, rain, wind) and 7-day forecast. |

---

## 3. Comprehensive Progress Log: What Has Been Done Till Now

### Phase 1: Architecture & Repository Governance
- **Repository Setup**: Initialized Git repository structure with `.gitignore`, `package.json`, and isolated service roots (`frontend/`, `backend/`, `ml-service/`).
- **Comprehensive Specifications**:
  - `README.md`: Detailed problem statement, 3-tier architecture design, schema collection definitions, API specification, and setup commands.
  - `CONTRIBUTING.md`: Established open-source guidelines, Git branch strategy (`feature/`, `bugfix/`), Conventional Commit standards, PR templates, and coding standards.
  - `docs/BACKEND_SPECIFICATION.md`: Single-source specification for all REST API endpoints, request/response bodies, status codes, and database schemas.
  - `context.txt`: Persistent milestone tracking file logging completed tasks and current status.

---

### Phase 2: Frontend Application Build (16 Complete Pages & Components)
Built a complete, zero-error production React 19 + TypeScript frontend application:

1. **Authentication Suite**:
   - `Login.tsx` & `Register.tsx`: User sign-in/registration with dynamic input validation, password toggle, JWT token capture, and error alerts.
2. **Operational Dashboards & GIS**:
   - `Dashboard.tsx`: Executive summary dashboard featuring real-time stat cards, field counts, crop alerts, satellite weather widget, and quick actions.
   - `Farms.tsx`: Farm enterprise management with modal forms to create/edit/delete farms (Name, Location, Area, Primary Crop).
   - `Fields.tsx` (Google Maps GIS Integration): Interactive Google Maps view using `@googlemaps/js-api-loader` with Google Places autocomplete, draggable markers, reverse geocoding, and custom field info cards.
3. **Agronomic Telemetry & Resource Management**:
   - `Crops.tsx`: Complete crop cycle tracking (planting date, expected harvest date, field binding, status tracking). Features dynamic Farm $\rightarrow$ Field cascaded selection dropdowns.
   - `Soil.tsx`: Soil health dashboard with NPK chemistry metrics (Nitrogen, Phosphorus, Potassium, pH, Organic Matter), Recharts bar charts, and automated composite soil health score badges.
   - `Weather.tsx`: Live microclimate weather dashboard powered by Open-Meteo & OpenWeatherMap API, rendering current temperature, humidity, wind, rainfall, 7-day forecast, and automated agricultural advisories (irrigation, spraying, fertilizer timing).
4. **Operational & Financial Management**:
   - `Inventory.tsx`: Farm equipment, seed, fertilizer, and pesticide stock tracker with low-stock warning indicators and reorder alerts.
   - `Workers.tsx`: Labor management portal for assigning workers to specific fields, tracking daily wages, roles, shift status, and contact info.
   - `Finance.tsx`: Double-entry style financial ledger tracking Income (crop sales, grants) and Expenses (labor, seeds, fuel, machinery), net profit calculation, and expense category breakdown pie charts.
   - `Harvest.tsx`: Harvest log management tracking yield quantity (kg/tons), harvest quality grade (Grade A/B/C), storage location, and batch notes.
5. **AI & Intelligence Hub**:
   - `AIRecommendations.tsx`: Explainable decision support engine providing actionable advice for crops, irrigation, fertilizer, and pest control with confidence scores and reasoning.
   - `DiseaseDetection.tsx`: Computer vision interface allowing farmers to upload leaf images to run diagnostic inference for crop diseases.
   - `Alerts.tsx` & `Reports.tsx`: Centralized alert notifications (weather, soil, inventory) and PDF/CSV downloadable summary reports.
6. **Reusable Component System & Services**:
   - **Components**: `GoogleFieldMap`, `StatCard`, `StatusBadge`, `PageHeader`, `SearchBar`, `DecisionSupportCard`, `SoilHealthCard`, `FormModal`, `ConfirmDialog`, `LoadingSkeleton`.
   - **Services**: `api.ts` (Axios instance with Bearer interceptor), `authService`, `farmService`, `cropService`, `soilService`, `weatherService`, `inventoryService`, `workerService`, `financeService`, `harvestService`, `predictionService`, `recommendationService`.
   - **State Management**: `AuthContext.tsx` for persistent JWT sessions and user roles; `ToastContext.tsx` for visual notification popups.

---

### Phase 3: Backend REST API & Database Models (Node.js + Express + MongoDB)
Built a modular, secure Node/Express REST API backend in `backend/` connected to a live MongoDB Atlas cluster:

#### 1. Database Schemas & Mongoose Models:
- `User.js`: User accounts with bcrypt password hashing pre-save hook, roles (`Admin`, `Farm Manager`, `Worker`), active status.
- `Farm.js`: Farm entity belonging to a user (`user`, `name`, `location`, `totalArea`, `soilType`).
- `Field.js`: Field sectors with geographic coordinates (`latitude`, `longitude`, `area`, `soilType`, `status`).
- `Crop.js`: Crop tracking with relational bindings (`user`, `farm`, `field`, `name`, `variety`, `plantingDate`, `expectedHarvestDate`, `status`).
- `SoilRecord.js`: Soil telemetry records (`user`, `field`, `nitrogen`, `phosphorus`, `potassium`, `ph`, `moisture`, `organicMatter`, `measuredAt`).
- `Inventory.js`: Stock inventory items (`user`, `farm`, `name`, `category`, `quantity`, `unit`, `minThreshold`, `costPerUnit`).
- `Worker.js`: Farm labor records (`user`, `farm`, `name`, `role`, `phone`, `dailyWage`, `assignedField`, `status`).
- `Income.js` & `Expense.js`: Financial transactions with categories (`sales`, `subsidies`, `seeds`, `labor`, `equipment`, `fuel`), amount, date, description.
- `Harvest.js`: Harvest batch logs (`user`, `farm`, `crop`, `field`, `harvestDate`, `yieldQuantity`, `unit`, `qualityGrade`).

#### 2. REST API Controllers & Routes:
- **Authentication Routes (`/api/auth`)**:
  - `POST /api/auth/register`: User registration with role assignment.
  - `POST /api/auth/login`: Authentication issuing HTTP-only cookie + JWT Bearer token.
  - `POST /api/auth/logout`: Cookie clearance and session invalidation.
  - `GET /api/users/profile`: Protected active profile verification endpoint.
- **Farm & Field GIS Routes (`/api/farms`, `/api/fields`)**: Full CRUD with field ownership validation and spatial coordinates.
- **Crop Routes (`/api/crops`)**: Relational verification ensuring field belongs to farm and farm belongs to logged-in user.
- **Soil Telemetry Routes (`/api/soil`)**: CRUD endpoints integrated with `soilHealthCalculator.js` utility calculating a composite 0-100 soil health score based on agronomic reference ranges.
- **Live Weather Routes (`/api/weather`)**: Integrated with Open-Meteo & OpenWeatherMap REST API and `agriculturalWeatherEngine.js` rule engine evaluating irrigation, heavy rain, spraying, and heat stress advisories.
- **Inventory & Worker Routes (`/api/inventory`, `/api/workers`)**: Full CRUD endpoints with low-stock calculation and worker assignment.
- **Financial Ledger Routes (`/api/finance`)**:
  - `GET /api/finance/income`, `POST /api/finance/income`, `DELETE /api/finance/income/:id`
  - `GET /api/finance/expense`, `POST /api/finance/expense`, `DELETE /api/finance/expense/:id`
  - `GET /api/finance/summary`: Computes total income, total expense, and net profit for a given farm.
- **Harvest Routes (`/api/harvest`)**: Harvest log CRUD operations.
- **Prediction Proxy Routes (`/api/predictions`)**: Proxy routes forwarding inference requests to the Python FastAPI ML microservice.

#### 3. Security & Middleware:
- `authMiddleware.js`: JWT token parser supporting HTTP-only cookies and `Authorization: Bearer <token>` headers.
- `roleMiddleware.js`: Role-based access control protecting administrative endpoints.
- `errorMiddleware.js`: Centralized error catching and response formatting.

---

### Phase 4: Machine Learning Microservice (`ml-service/`)
Implemented an isolated Python FastAPI microservice architecture under `ml-service/`:

1. **Service Framework**:
   - `app/main.py`: FastAPI server exposing `/health`, `/predict/crop`, `/predict/yield`, and `/predict/disease` endpoints.
   - `app/model.py` & `app/predictor.py`: Inference wrapper loading pre-trained model artifacts (`.pkl`, `.onnx`, `.pt`) with fallback heuristic rule engines for zero-downtime execution.
2. **Dataset & Training Pipelines**:
   - `datasets/`: Agronomic datasets containing NPK values, soil pH, rainfall, temperature, and crop yields.
   - `training/`: Training scripts for Scikit-Learn Decision Trees / Random Forests and PyTorch / YOLO vision models.

---

### Phase 5: End-to-End Frontend-Backend Integration
- **Live Persistence**: Replaced all frontend mock implementations with live Axios REST API calls targeting MongoDB Atlas.
- **CORS & Auth Resolution**: Configured allowed origins, `withCredentials: true`, and automatic header token injection.
- **TypeScript Verification**: Achieved zero compilation errors across `frontend` (`npx tsc --noEmit -p tsconfig.app.json` PASS).
- **Vite Build Verification**: Successfully compiled clean production bundle via `npm run build`.

---

## 4. Feature Implementation & System Matrix

| Feature Module | Frontend Page | Backend Endpoint | Database Model | Real API Connected? | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Authentication & Profile** | `Login.tsx`, `Register.tsx` | `/api/auth/login`, `/api/users/profile` | `User.js` | Yes | **Completed** |
| **Dashboard Overview** | `Dashboard.tsx` | Summary aggregations | Aggregated | Yes | **Completed** |
| **Farm Management** | `Farms.tsx` | `/api/farms` | `Farm.js` | Yes | **Completed** |
| **Field Sector GIS (Google Maps)**| `Fields.tsx` | `/api/fields` | `Field.js` | Yes | **Completed** |
| **Crop Cycle Tracker** | `Crops.tsx` | `/api/crops` | `Crop.js` | Yes | **Completed** |
| **Soil Telemetry & Health** | `Soil.tsx` | `/api/soil` | `SoilRecord.js` | Yes | **Completed** |
| **Microclimate Live Weather** | `Weather.tsx` | `/api/weather` | Open-Meteo API | Yes | **Completed** |
| **Stock Inventory** | `Inventory.tsx` | `/api/inventory` | `Inventory.js` | Yes | **Completed** |
| **Workers & Labor** | `Workers.tsx` | `/api/workers` | `Worker.js` | Yes | **Completed** |
| **Financial Ledger** | `Finance.tsx` | `/api/finance/*` | `Income.js`, `Expense.js` | Yes | **Completed** |
| **Harvest Logging** | `Harvest.tsx` | `/api/harvest` | `Harvest.js` | Yes | **Completed** |
| **AI Crop & Advisory Engine** | `AIRecommendations.tsx` | `/api/predictions/crop-recommendation` | FastApi Proxy | Yes | **Completed** |
| **Leaf Disease Diagnosis Vision** | `DiseaseDetection.tsx` | `/api/predictions/disease-detection` | FastAPI / PyTorch | Yes | **Completed** |
| **Alert Notifications** | `Alerts.tsx` | `/api/alerts` | Rule Engine | Yes | **Completed** |
| **PDF/CSV Reports Export** | `Reports.tsx` | Frontend Export Engine | Canvas/CSV | Yes | **Completed** |

---

## 5. Summary of Next Roadmap Steps

1. **Docker Containerization**: Author `docker-compose.yml` orchestrating Frontend (Nginx), Backend (Node), ML Microservice (FastAPI), and MongoDB.
2. **IoT Hardware Ingestion Pipeline**: Implement MQTT broker integration to directly ingest live soil sensor streams (ESP32/Arduino NPK probes).
3. **Mobile PWA Optimizations**: Configure Progressive Web App offline caching and service workers for low-connectivity farm environments.

---
*Document updated automatically by AGY Assistant on September 20, 2026.*
