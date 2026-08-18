import api from './api';
import { Farm, Field } from '../types';

export const MOCK_FARMS: Farm[] = [
  {
    id: 'farm-1',
    name: 'Green Valley Main Estate',
    location: 'Central Valley, Sector 4',
    totalArea: 120.5,
    fieldCount: 6,
    activeCrops: 4,
    status: 'Active',
    description: 'Primary organic production hub specializing in nightshade crops and leafy greens.',
    lat: 12.9716,
    lng: 77.5946,
    createdAt: '2025-01-15',
  },
  {
    id: 'farm-2',
    name: 'Highland Grain & Pulses',
    location: 'North Plateau, Sector 12',
    totalArea: 85.0,
    fieldCount: 4,
    activeCrops: 3,
    status: 'Active',
    description: 'Dryland grain production focusing on wheat, maize, and pulse rotation cycles.',
    lat: 13.0827,
    lng: 80.2707,
    createdAt: '2025-02-01',
  },
  {
    id: 'farm-3',
    name: 'Riverside Orchard & Vineyard',
    location: 'East Basin, Sector 8',
    totalArea: 45.2,
    fieldCount: 3,
    activeCrops: 2,
    status: 'Under Maintenance',
    description: 'High-density fruit orchard equipped with drip fertigation networks.',
    lat: 12.2958,
    lng: 76.6394,
    createdAt: '2025-03-10',
  },
];

export const MOCK_FIELDS: Field[] = [
  {
    id: 'fld-101',
    farmId: 'farm-1',
    farmName: 'Green Valley Main Estate',
    name: 'Field A - Tomato Plot',
    area: 15.4,
    soilType: 'Loamy Clay',
    currentCrop: 'Tomato (Roma)',
    status: 'Active',
    lat: 12.9725,
    lng: 77.5955,
    soilHealthScore: 84,
    npk: { nitrogen: 42, phosphorus: 38, potassium: 55 },
    pH: 6.5,
    moisture: 28,
  },
  {
    id: 'fld-102',
    farmId: 'farm-1',
    farmName: 'Green Valley Main Estate',
    name: 'Field B - Potato Sector',
    area: 22.0,
    soilType: 'Sandy Loam',
    currentCrop: 'Potato (Yukon Gold)',
    status: 'Active',
    lat: 12.9705,
    lng: 77.5935,
    soilHealthScore: 76,
    npk: { nitrogen: 35, phosphorus: 28, potassium: 40 },
    pH: 6.2,
    moisture: 32,
  },
  {
    id: 'fld-103',
    farmId: 'farm-1',
    farmName: 'Green Valley Main Estate',
    name: 'Field C - Sweet Corn',
    area: 18.5,
    soilType: 'Silt Loam',
    currentCrop: 'Maize (Golden Sweet)',
    status: 'Active',
    lat: 12.9735,
    lng: 77.5965,
    soilHealthScore: 90,
    npk: { nitrogen: 58, phosphorus: 45, potassium: 62 },
    pH: 6.8,
    moisture: 35,
  },
  {
    id: 'fld-201',
    farmId: 'farm-2',
    farmName: 'Highland Grain & Pulses',
    name: 'Field D - Wheat Belt',
    area: 30.0,
    soilType: 'Clay Loam',
    currentCrop: 'Durum Wheat',
    status: 'Active',
    lat: 13.0835,
    lng: 80.2715,
    soilHealthScore: 81,
    npk: { nitrogen: 48, phosphorus: 32, potassium: 50 },
    pH: 7.1,
    moisture: 22,
  },
  {
    id: 'fld-301',
    farmId: 'farm-3',
    farmName: 'Riverside Orchard',
    name: 'Field E - Vineyard Block',
    area: 12.5,
    soilType: 'Sandy Clay',
    currentCrop: 'Table Grapes',
    status: 'Preparation',
    lat: 12.2965,
    lng: 76.6405,
    soilHealthScore: 68,
    npk: { nitrogen: 24, phosphorus: 20, potassium: 35 },
    pH: 5.8,
    moisture: 18,
  },
];

export const farmService = {
  getFarms: async (): Promise<Farm[]> => {
    try {
      const res = await api.get('/farms');
      return res.data;
    } catch {
      return MOCK_FARMS;
    }
  },

  getFields: async (farmId?: string): Promise<Field[]> => {
    try {
      const res = await api.get('/fields', { params: { farmId } });
      return res.data;
    } catch {
      if (farmId) return MOCK_FIELDS.filter((f) => f.farmId === farmId);
      return MOCK_FIELDS;
    }
  },

  createFarm: async (farmData: Partial<Farm>): Promise<Farm> => {
    try {
      const res = await api.post('/farms', farmData);
      return res.data;
    } catch {
      const newFarm: Farm = {
        id: `farm-${Date.now()}`,
        name: farmData.name || 'New Farm Estate',
        location: farmData.location || 'Sector 1',
        totalArea: farmData.totalArea || 10,
        fieldCount: 0,
        activeCrops: 0,
        status: 'Active',
        description: farmData.description || 'Newly added agricultural property.',
        lat: farmData.lat || 12.9716,
        lng: farmData.lng || 77.5946,
        createdAt: new Date().toISOString().split('T')[0],
      };
      MOCK_FARMS.push(newFarm);
      return newFarm;
    }
  },

  createField: async (fieldData: Partial<Field>): Promise<Field> => {
    try {
      const res = await api.post('/fields', fieldData);
      return res.data;
    } catch {
      const newField: Field = {
        id: `fld-${Date.now()}`,
        farmId: fieldData.farmId || 'farm-1',
        farmName: fieldData.farmName || 'Green Valley Main Estate',
        name: fieldData.name || 'New Field Sector',
        area: fieldData.area || 5.0,
        soilType: fieldData.soilType || 'Loamy Clay',
        currentCrop: fieldData.currentCrop || 'None',
        status: fieldData.status || 'Active',
        lat: fieldData.lat || 12.9716,
        lng: fieldData.lng || 77.5946,
        soilHealthScore: 80,
        npk: { nitrogen: 40, phosphorus: 35, potassium: 45 },
        pH: 6.5,
        moisture: 25,
      };
      MOCK_FIELDS.push(newField);
      return newField;
    }
  },

  deleteFarm: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/farms/${id}`);
      return true;
    } catch {
      const idx = MOCK_FARMS.findIndex((f) => f.id === id);
      if (idx !== -1) MOCK_FARMS.splice(idx, 1);
      return true;
    }
  },

  deleteField: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/fields/${id}`);
      return true;
    } catch {
      const idx = MOCK_FIELDS.findIndex((f) => f.id === id);
      if (idx !== -1) MOCK_FIELDS.splice(idx, 1);
      return true;
    }
  },
};
