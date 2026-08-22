export type UserRole = 'Farm Manager' | 'Worker' | 'Agronomist' | 'Admin';

/**
 * Represents a user account in the Farm Management System.
 * Supports both normalized `id` and raw MongoDB document `_id`.
 */
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  farmName?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Represents a Farm entity.
 * `id` is the primary normalized identifier used across frontend services.
 * `_id` is an optional fallback for raw MongoDB document object returns.
 */
export interface Farm {
  id: string;
  _id?: string;
  name: string;
  location: string;
  totalArea: number; // in hectares
  fieldCount: number;
  activeCrops: number;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  description?: string;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface SoilNPK {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface Field {
  id: string;
  _id?: string;
  farmId: string;
  farmName: string;
  name: string;
  area: number; // in hectares or acres
  areaUnit?: string;
  soilType: string;
  currentCrop: string;
  irrigationType?: string;
  sowingDate?: string;
  expectedHarvestDate?: string;
  notes?: string;
  address?: string;
  status: 'Active' | 'Fallow' | 'Preparation' | 'Harvesting';
  lat: number;
  lng: number;
  soilHealthScore: number;
  npk: SoilNPK;
  pH: number;
  moisture: number; // percentage
}

export type GrowthStage = 'Planting' | 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvest';

export interface Crop {
  id: string;
  _id?: string;
  name: string;
  variety: string;
  farmId?: string;
  farmName?: string;
  fieldId?: string;
  fieldName?: string;
  farm?: string | { _id: string; name: string };
  field?: string | { _id: string; name: string };
  plantingDate?: string;
  sowingDate?: string;
  growthStage?: GrowthStage | string;
  stage?: GrowthStage | string;
  expectedHarvest?: string;
  expectedHarvestDate?: string;
  status?: 'Healthy' | 'Needs Attention' | 'Critical Risk' | 'At Risk' | 'Diseased' | string;
  healthStatus?: string;
  estimatedYieldTons?: number;
}

export interface SoilRecord {
  id: string;
  fieldId: string;
  fieldName: string;
  date: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
  moisture: number;
  organicMatter: number;
  healthScore: number;
  notes?: string;
}

export interface WeatherForecastDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainProb: number;
  icon: string;
}

export interface WeatherRecord {
  temperature: number; // Celsius
  humidity: number; // %
  windSpeed: number; // km/h
  rainfall: number; // mm
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Thunderstorm' | 'Windy';
  location: string;
  timestamp: string;
  forecast: WeatherForecastDay[];
  alert?: {
    severity: 'High' | 'Medium' | 'Low';
    message: string;
    action: string;
  };
}

export type InventoryCategory = 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Tools' | 'Equipment';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  supplier: string;
  pricePerUnit: number;
}

export type WorkerStatus = 'Available' | 'Working' | 'On Leave';

export interface Worker {
  id: string;
  name: string;
  role: string;
  assignedField: string;
  currentTask: string;
  hoursLogged: number;
  status: WorkerStatus;
  phone: string;
  email: string;
  avatar?: string;
}

export type ExpenseCategory = 'Seeds' | 'Fertilizer' | 'Labour' | 'Fuel' | 'Equipment' | 'Pesticides' | 'Other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  fieldId?: string;
  fieldName?: string;
  paymentMethod: string;
}

export interface Income {
  id: string;
  cropName: string;
  buyer: string;
  amount: number;
  quantityTons: number;
  date: string;
  invoiceNumber: string;
}

export interface Harvest {
  id: string;
  cropName: string;
  fieldName: string;
  harvestDate: string;
  predictedYieldTons: number;
  actualYieldTons: number;
  differencePercent: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C';
  storageLocation: string;
  revenue: number;
}

export interface CropRecommendationResult {
  crop: string;
  confidence: number; // 0-100%
  suitabilityReason: string;
  expectedYield: string;
}

export interface YieldPredictionResult {
  predictedYieldPerHectare: number;
  totalHarvestTons: number;
  confidenceScore: number;
  influencingFactors: string[];
}

export interface FertilizerRecommendationResult {
  soilCondition: string;
  cropRequirement: string;
  nutrientGap: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  recommendedFertilizer: string;
  recommendedDosage: string;
  recommendedTiming: string;
}

export interface DiseaseDetectionResult {
  diseaseName: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  description: string;
  recommendedAction: string;
  affectedField?: string;
}

export type AlertPriority = 'High' | 'Medium' | 'Low';
export type AlertCategory = 'Weather' | 'Disease' | 'Inventory' | 'Irrigation' | 'Harvest' | 'System';

export interface Alert {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  priority: AlertPriority;
  isRead: boolean;
  timestamp: string;
  fieldId?: string;
}

export interface DecisionSupportItem {
  id: string;
  title: string;
  category: string;
  priority: AlertPriority;
  factors: {
    label: string;
    value: string;
  }[];
  recommendedAction: string;
  reasoning: string;
}
