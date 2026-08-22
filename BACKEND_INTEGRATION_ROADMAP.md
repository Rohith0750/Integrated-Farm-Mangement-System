# 🚜 Integrated Farm Management System - Real-Time Backend Integration Plan

This roadmap provides a complete, step-by-step technical guide to connect your static frontend pages and components to a live, real-time Node.js + Express + MongoDB Atlas backend.

---

## 📑 Table of Contents
1. [Overview & Architecture](#-overview--architecture)
2. [Step-by-Step Integration Matrix](#-step-by-step-integration-matrix)
3. [Detailed Phase Breakdown](#-detailed-phase-breakdown)
   - [Phase 1: Authentication & User Session](#phase-1-authentication--user-session)
   - [Phase 2: Farms, Fields & GIS Map Integration](#phase-2-farms-fields--gis-map-integration)
   - [Phase 3: Crop Management & Stage Tracking](#phase-3-crop-management--stage-tracking)
   - [Phase 4: Real-Time Soil Sensor Telemetry (IoT)](#phase-4-real-time-soil-sensor-telemetry-iot)
   - [Phase 5: Weather Service & Forecasting API](#phase-5-weather-service--forecasting-api)
   - [Phase 6: Financial Ledger & Analytics](#phase-6-financial-ledger--analytics)
   - [Phase 7: Inventory & Asset Management](#phase-7-inventory--asset-management)
   - [Phase 8: Workers & Field Task Allocation](#phase-8-workers--field-task-allocation)
   - [Phase 9: Real-Time Alerts & Notification Engine (WebSockets)](#phase-9-real-time-alerts--notification-engine-websockets)
   - [Phase 10: AI Crop Recommendations & Leaf Disease Detection](#phase-10-ai-crop-recommendations--leaf-disease-detection)
4. [How to Replace Static Mocks with Real APIs](#-how-to-replace-static-mocks-with-real-apis)
5. [Recommended Execution Order](#-recommended-execution-order)

---

## 🏗️ Overview & Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Axios + Socket.io-client
- **Backend**: Node.js + Express.js + Mongoose + MongoDB Atlas + JWT + Socket.io
- **Geospatial & IoT**: Google Maps API + GeoJSON + Real-Time Sensor Telemetry

### Data Flow Pattern
```
[ Frontend Page ] ──> [ Service (e.g. farmService.ts) ] ──> [ Axios (api.ts) ]
                                                                   │
                                                           HTTP Request with JWT
                                                                   ▼
[ Socket.io / Push Alerts ] <── [ Express Route & Controller ] <── [ MongoDB Atlas ]
```

---

## 📊 Step-by-Step Integration Matrix

| Module | Frontend File | Service File | Backend Route | Backend Controller | Database Model | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth** | `Login.tsx`, `Register.tsx` | `authService.ts` | `/api/auth` | `authController.js` | `User.js` | ✅ Connected |
| **Fields / GIS** | `Fields.tsx` | `farmService.ts` | `/api/fields` | `fieldController.js` | `Field.js` | ✅ Connected |
| **Farms** | `Farms.tsx` | `farmService.ts` | `/api/farms` | `farmController.js` | `Farm.js` (Pending) | 🟡 Needs API |
| **Crops** | `Crops.tsx` | `cropService.ts` | `/api/crops` | `cropController.js` | `Crop.js` (Pending) | 🟡 Needs API |
| **Soil & IoT** | `Soil.tsx` | `soilService.ts` | `/api/soil` | `soilController.js` | `SoilLog.js` (Pending) | 🟡 Needs API |
| **Weather** | `Weather.tsx` | `weatherService.ts` | `/api/weather` | `weatherController.js` | OpenWeather API | 🟡 Needs API |
| **Finance** | `Finance.tsx` | `financeService.ts` | `/api/finance` | `financeController.js` | `Transaction.js` | 🟡 Needs API |
| **Inventory** | `Inventory.tsx` | `inventoryService.ts` | `/api/inventory` | `inventoryController.js` | `Inventory.js` | 🟡 Needs API |
| **Workers** | `Workers.tsx` | `workerService.ts` | `/api/workers` | `workerController.js` | `Worker.js`, `Task.js` | 🟡 Needs API |
| **Alerts** | `Alerts.tsx` | `alertService.ts` | `/api/alerts` | `alertController.js` | `Alert.js` + Sockets | 🔴 WebSockets |
| **AI Insights** | `AIRecommendations.tsx` | `recommendationService.ts` | `/api/ai` | `aiController.js` | ML / Gemini Model | 🟡 Needs API |

---

## 🛠️ Detailed Phase Breakdown

### Phase 1: Authentication & User Session
- **Objective**: Authenticate users, issue JWT token, and protect routes.
- **What to do**:
  1. **Backend**: Routes `/api/auth/register`, `/api/auth/login`, and `/api/auth/me`.
  2. **Frontend**: Store JWT in `localStorage.setItem('prj533_token', token)`.
  3. **Verification**: Verify token automatic injection via `api.ts` Axios request interceptor.

---

### Phase 2: Farms, Fields & GIS Map Integration
- **Objective**: Manage physical farms, boundaries, and Google Map coordinates in real-time.
- **Backend Tasks**:
  - Create `backend/src/models/Farm.js`:
    ```javascript
    const farmSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      location: String,
      totalArea: Number,
      lat: Number,
      lng: Number,
      status: { type: String, enum: ['Active', 'Under Maintenance', 'Inactive'], default: 'Active' }
    }, { timestamps: true });
    ```
  - Create `farmController.js` (`getFarms`, `createFarm`, `updateFarm`, `deleteFarm`).
  - Register `/api/farms` in `backend/src/server.js`.
- **Frontend Tasks**:
  - In `frontend/src/services/farmService.ts`, connect `getFarms()` to `api.get('/farms')`.
  - In `frontend/src/pages/Fields.tsx`, load real coordinates into `<GoogleFieldMap />`.

---

### Phase 3: Crop Management & Stage Tracking
- **Objective**: Track planted crops, sowing dates, growth stages, and estimated harvest.
- **Backend Tasks**:
  - Create `backend/src/models/Crop.js` (name, variety, fieldId, sowingDate, expectedHarvest, stage, healthStatus).
  - Create `backend/src/routes/cropRoutes.js` and `cropController.js`.
- **Frontend Tasks**:
  - Update `frontend/src/services/cropService.ts` to call `/api/crops`.
  - Wire `frontend/src/pages/Crops.tsx` to handle adding crops and updating growth progress.

---

### Phase 4: Real-Time Soil Sensor Telemetry (IoT)
- **Objective**: Store and stream live NPK, pH, moisture, and temperature readings.
- **Backend Tasks**:
  - Create `backend/src/models/SoilLog.js` (fieldId, npk: { nitrogen, phosphorus, potassium }, pH, moisture, temperature, recordedAt).
  - Add route `/api/soil/latest/:fieldId` and `/api/soil/history/:fieldId`.
  - Optional IoT simulation: Add a cron job or interval in backend `server.js` that emits random sensor ticks to connected clients via Socket.io.
- **Frontend Tasks**:
  - Update `frontend/src/pages/Soil.tsx` to display real line charts and gauge components using telemetry logs.

---

### Phase 5: Weather Service & Forecasting API
- **Objective**: Fetch real-time weather forecasts based on farm GPS coordinates.
- **Backend Tasks**:
  - Create `backend/src/controllers/weatherController.js` to query OpenWeatherMap / WeatherAPI using `process.env.WEATHER_API_KEY`.
  - Route: `GET /api/weather?lat=12.9716&lng=77.5946`.
- **Frontend Tasks**:
  - Connect `frontend/src/services/weatherService.ts` to `/api/weather`.

---

### Phase 6: Financial Ledger & Analytics
- **Objective**: Track income (harvest sales) and expenses (seeds, fertilizer, labor, equipment).
- **Backend Tasks**:
  - Create `backend/src/models/Transaction.js` (type: 'Income'|'Expense', amount, category, date, description, fieldId).
  - Create `backend/src/controllers/financeController.js` returning monthly aggregations.
- **Frontend Tasks**:
  - Connect `frontend/src/pages/Finance.tsx` to `/api/finance/summary` and `/api/finance/transactions`.

---

### Phase 7: Inventory & Asset Management
- **Objective**: Track fertilizers, pesticides, tools, and seeds with low-stock alerts.
- **Backend Tasks**:
  - Create `backend/src/models/Inventory.js` (itemName, category, quantity, unit, reorderThreshold, unitPrice).
  - Create `/api/inventory` CRUD endpoints.
- **Frontend Tasks**:
  - Wire `frontend/src/pages/Inventory.tsx` with modal dialogs to perform real stock additions and deductions.

---

### Phase 8: Workers & Field Task Allocation
- **Objective**: Assign farm workers to fields and track task completion statuses.
- **Backend Tasks**:
  - Create `Worker.js` and `Task.js` models.
  - Endpoints `/api/workers` and `/api/tasks`.
- **Frontend Tasks**:
  - Wire `frontend/src/pages/Workers.tsx` to create and complete assigned field tasks.

---

### Phase 9: Real-Time Alerts & Notification Engine (WebSockets)
- **Objective**: Immediately notify farmers when soil moisture is critical, weather alerts strike, or stock is low.
- **Backend Tasks**:
  - Integrate `socket.io` in `backend/src/server.js`:
    ```javascript
    const http = require('http');
    const { Server } = require('socket.io');
    const server = http.createServer(app);
    const io = new Server(server, { cors: corsOptions });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
    });

    // Make io accessible in controllers via req.app.get('io')
    app.set('io', io);
    ```
  - Emit alert event on threshold breach: `req.app.get('io').emit('alert:new', alertData)`.
- **Frontend Tasks**:
  - Subscribe in frontend `Alerts.tsx`:
    ```typescript
    import { io } from 'socket.io-client';
    const socket = io('http://localhost:5000');
    socket.on('alert:new', (newAlert) => setAlerts(prev => [newAlert, ...prev]));
    ```

---

### Phase 10: AI Crop Recommendations & Leaf Disease Detection
- **Objective**: Provide ML/AI-powered insights for crop health and disease identification.
- **Backend Tasks**:
  - Add `/api/ai/recommendations` querying soil + weather data to generate AI tips.
  - Add `/api/ai/detect-disease` accepting leaf image uploads via `multer`.
- **Frontend Tasks**:
  - Connect `AIRecommendations.tsx` and `DiseaseDetection.tsx` to backend AI endpoints.

---

## ⚡ How to Replace Static Mocks with Real APIs

Currently, service files like `farmService.ts` have fallback code:
```typescript
// BEFORE (Mock Fallback Pattern):
getFields: async (): Promise<Field[]> => {
  try {
    const res = await api.get('/fields');
    return res.data;
  } catch {
    return MOCK_FIELDS; // <--- MOCK DATA FALLBACK
  }
}
```

To convert to **Pure Real Data Mode**:
1. Remove `catch { return MOCK_FIELDS; }`.
2. Throw errors so the UI displays actual server status or error toasts:
```typescript
// AFTER (Pure Real Data Pattern):
getFields: async (): Promise<Field[]> => {
  const res = await api.get('/fields');
  return res.data;
}
```

---

## 🚀 Recommended Execution Order

Follow this exact sequence to connect everything step-by-step:

1. **Step 1**: Build `Farm.js` model & `farmController.js` in backend -> Connect `Farms.tsx`.
2. **Step 2**: Build `Crop.js` model & `cropController.js` in backend -> Connect `Crops.tsx`.
3. **Step 3**: Build `SoilLog.js` model & `soilController.js` in backend -> Connect `Soil.tsx`.
4. **Step 4**: Build `Transaction.js` model & `financeController.js` in backend -> Connect `Finance.tsx`.
5. **Step 5**: Build `Inventory.js` model & `inventoryController.js` in backend -> Connect `Inventory.tsx`.
6. **Step 6**: Build `Worker.js` and `Task.js` models in backend -> Connect `Workers.tsx`.
7. **Step 7**: Configure OpenWeather API proxy route -> Connect `Weather.tsx`.
8. **Step 8**: Add `Socket.io` server to `backend/src/server.js` -> Connect `Alerts.tsx` for real-time notifications.
9. **Step 9**: Connect AI & Disease Detection controllers -> Connect `AIRecommendations.tsx`.

---
*Created for Integrated Farm Management System.*
