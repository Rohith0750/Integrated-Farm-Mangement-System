import api from './api';
import { SoilRecord } from '../types';

export const MOCK_SOIL_RECORDS: SoilRecord[] = [
  {
    id: 'soil-101',
    fieldId: 'fld-101',
    fieldName: 'Field A - Tomato Plot',
    date: '2026-08-15',
    nitrogen: 42,
    phosphorus: 38,
    potassium: 55,
    pH: 6.5,
    moisture: 28,
    organicMatter: 3.4,
    healthScore: 84,
    notes: 'Optimal nutrient balance for tomato flowering phase.',
  },
  {
    id: 'soil-102',
    fieldId: 'fld-102',
    fieldName: 'Field B - Potato Sector',
    date: '2026-08-14',
    nitrogen: 35,
    phosphorus: 28,
    potassium: 40,
    pH: 6.2,
    moisture: 32,
    organicMatter: 2.8,
    healthScore: 76,
    notes: 'Nitrogen level is slightly low; light top dressing recommended.',
  },
  {
    id: 'soil-103',
    fieldId: 'fld-103',
    fieldName: 'Field C - Sweet Corn',
    date: '2026-08-10',
    nitrogen: 58,
    phosphorus: 45,
    potassium: 62,
    pH: 6.8,
    moisture: 35,
    organicMatter: 4.1,
    healthScore: 90,
    notes: 'Excellent organic matter composition and high soil microbial activity.',
  },
  {
    id: 'soil-104',
    fieldId: 'fld-201',
    fieldName: 'Field D - Wheat Belt',
    date: '2026-08-05',
    nitrogen: 48,
    phosphorus: 32,
    potassium: 50,
    pH: 7.1,
    moisture: 22,
    organicMatter: 3.0,
    healthScore: 81,
    notes: 'Soil moisture low due to dry spell prior to grain harvest.',
  },
];

export const soilService = {
  getSoilRecords: async (fieldId?: string): Promise<SoilRecord[]> => {
    try {
      const res = await api.get('/soil', { params: { fieldId } });
      return res.data;
    } catch {
      if (fieldId) return MOCK_SOIL_RECORDS.filter((s) => s.fieldId === fieldId);
      return MOCK_SOIL_RECORDS;
    }
  },

  addSoilRecord: async (data: Partial<SoilRecord>): Promise<SoilRecord> => {
    try {
      const res = await api.post('/soil', data);
      return res.data;
    } catch {
      // Calculate health score heuristic
      const n = data.nitrogen || 40;
      const p = data.phosphorus || 35;
      const k = data.potassium || 45;
      const ph = data.pH || 6.5;
      const calculatedScore = Math.min(100, Math.round((n * 0.3) + (p * 0.3) + (k * 0.25) + (ph * 5)));

      const newRecord: SoilRecord = {
        id: `soil-${Date.now()}`,
        fieldId: data.fieldId || 'fld-101',
        fieldName: data.fieldName || 'Field A - Tomato Plot',
        date: data.date || new Date().toISOString().split('T')[0],
        nitrogen: n,
        phosphorus: p,
        potassium: k,
        pH: ph,
        moisture: data.moisture || 25,
        organicMatter: data.organicMatter || 3.0,
        healthScore: calculatedScore,
        notes: data.notes || 'Routine soil test recording.',
      };
      MOCK_SOIL_RECORDS.unshift(newRecord);
      return newRecord;
    }
  },
};
