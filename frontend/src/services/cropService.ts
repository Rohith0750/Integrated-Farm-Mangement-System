import api from './api';
import { Crop } from '../types';

export const MOCK_CROPS: Crop[] = [
  {
    id: 'crp-01',
    name: 'Tomato',
    variety: 'Roma VF',
    fieldId: 'fld-101',
    fieldName: 'Field A - Tomato Plot',
    plantingDate: '2026-06-01',
    growthStage: 'Flowering',
    expectedHarvest: '2026-08-25',
    status: 'Healthy',
    estimatedYieldTons: 42.5,
  },
  {
    id: 'crp-02',
    name: 'Potato',
    variety: 'Yukon Gold',
    fieldId: 'fld-102',
    fieldName: 'Field B - Potato Sector',
    plantingDate: '2026-05-15',
    growthStage: 'Fruiting',
    expectedHarvest: '2026-09-10',
    status: 'Needs Attention',
    estimatedYieldTons: 68.0,
  },
  {
    id: 'crp-03',
    name: 'Maize',
    variety: 'Golden Sweet Hybrid',
    fieldId: 'fld-103',
    fieldName: 'Field C - Sweet Corn',
    plantingDate: '2026-06-10',
    growthStage: 'Vegetative',
    expectedHarvest: '2026-10-05',
    status: 'Healthy',
    estimatedYieldTons: 54.0,
  },
  {
    id: 'crp-04',
    name: 'Wheat',
    variety: 'Durum Amber',
    fieldId: 'fld-201',
    fieldName: 'Field D - Wheat Belt',
    plantingDate: '2026-04-20',
    growthStage: 'Harvest',
    expectedHarvest: '2026-08-20',
    status: 'Healthy',
    estimatedYieldTons: 110.0,
  },
];

export const cropService = {
  getCrops: async (): Promise<Crop[]> => {
    try {
      const res = await api.get('/crops');
      return res.data;
    } catch {
      return MOCK_CROPS;
    }
  },

  createCrop: async (cropData: Partial<Crop>): Promise<Crop> => {
    try {
      const res = await api.post('/crops', cropData);
      return res.data;
    } catch {
      const newCrop: Crop = {
        id: `crp-${Date.now()}`,
        name: cropData.name || 'Tomato',
        variety: cropData.variety || 'Hybrid-1',
        fieldId: cropData.fieldId || 'fld-101',
        fieldName: cropData.fieldName || 'Field A',
        plantingDate: cropData.plantingDate || new Date().toISOString().split('T')[0],
        growthStage: cropData.growthStage || 'Germination',
        expectedHarvest: cropData.expectedHarvest || '2026-11-01',
        status: cropData.status || 'Healthy',
        estimatedYieldTons: cropData.estimatedYieldTons || 25.0,
      };
      MOCK_CROPS.unshift(newCrop);
      return newCrop;
    }
  },

  deleteCrop: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/crops/${id}`);
      return true;
    } catch {
      const idx = MOCK_CROPS.findIndex((c) => c.id === id);
      if (idx !== -1) MOCK_CROPS.splice(idx, 1);
      return true;
    }
  },
};
