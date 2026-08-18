import api from './api';
import { Expense, Income, Harvest } from '../types';

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-101',
    category: 'Fertilizer',
    description: 'Bulk purchase of NPK 15-15-15 and Urea for Field A',
    amount: 1450.0,
    date: '2026-08-02',
    fieldName: 'Field A - Tomato Plot',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'exp-102',
    category: 'Labour',
    description: 'Weekly field worker payroll for crop maintenance & weeding',
    amount: 2200.0,
    date: '2026-08-08',
    fieldName: 'All Fields',
    paymentMethod: 'Direct Deposit',
  },
  {
    id: 'exp-103',
    category: 'Fuel',
    description: 'Diesel fuel refill for tractor tilling in Field B',
    amount: 580.0,
    date: '2026-08-12',
    fieldName: 'Field B - Potato Sector',
    paymentMethod: 'Corporate Card',
  },
  {
    id: 'exp-104',
    category: 'Seeds',
    description: 'High-yield hybrid tomato seed trays',
    amount: 890.0,
    date: '2026-07-28',
    fieldName: 'Field A - Tomato Plot',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'exp-105',
    category: 'Pesticides',
    description: 'Fungicide preventive spray supply',
    amount: 340.0,
    date: '2026-08-14',
    fieldName: 'Field B - Potato Sector',
    paymentMethod: 'Cash',
  },
];

export const MOCK_INCOMES: Income[] = [
  {
    id: 'inc-201',
    cropName: 'Tomato (Roma)',
    buyer: 'FreshHarvest Foods Wholesalers',
    amount: 12800.0,
    quantityTons: 14.5,
    date: '2026-08-10',
    invoiceNumber: 'INV-2026-0891',
  },
  {
    id: 'inc-202',
    cropName: 'Durum Wheat',
    buyer: 'Regional Grain Mill Co-op',
    amount: 24500.0,
    quantityTons: 35.0,
    date: '2026-08-01',
    invoiceNumber: 'INV-2026-0842',
  },
  {
    id: 'inc-203',
    cropName: 'Sweet Corn',
    buyer: 'Metro Organic Supermarkets',
    amount: 9200.0,
    quantityTons: 8.2,
    date: '2026-07-25',
    invoiceNumber: 'INV-2026-0780',
  },
];

export const MOCK_HARVESTS: Harvest[] = [
  {
    id: 'hrv-01',
    cropName: 'Durum Wheat',
    fieldName: 'Field D - Wheat Belt',
    harvestDate: '2026-08-01',
    predictedYieldTons: 36.0,
    actualYieldTons: 35.0,
    differencePercent: -2.77,
    qualityGrade: 'Grade A',
    storageLocation: 'Silo Block 3',
    revenue: 24500.0,
  },
  {
    id: 'hrv-02',
    cropName: 'Tomato (Early Crop)',
    fieldName: 'Field A - Tomato Plot',
    harvestDate: '2026-08-10',
    predictedYieldTons: 15.2,
    actualYieldTons: 14.8,
    differencePercent: -2.63,
    qualityGrade: 'Grade A',
    storageLocation: 'Cold Storage Room 2',
    revenue: 12800.0,
  },
  {
    id: 'hrv-03',
    cropName: 'Sweet Corn',
    fieldName: 'Field C - Sweet Corn',
    harvestDate: '2026-07-25',
    predictedYieldTons: 7.8,
    actualYieldTons: 8.2,
    differencePercent: 5.13,
    qualityGrade: 'Grade B',
    storageLocation: 'Warehouse Bay 1',
    revenue: 9200.0,
  },
];

export const financeService = {
  getExpenses: async (): Promise<Expense[]> => {
    try {
      const res = await api.get('/expenses');
      return res.data;
    } catch {
      return MOCK_EXPENSES;
    }
  },

  getIncome: async (): Promise<Income[]> => {
    try {
      const res = await api.get('/income');
      return res.data;
    } catch {
      return MOCK_INCOMES;
    }
  },

  getHarvests: async (): Promise<Harvest[]> => {
    try {
      const res = await api.get('/harvests');
      return res.data;
    } catch {
      return MOCK_HARVESTS;
    }
  },

  addExpense: async (data: Partial<Expense>): Promise<Expense> => {
    try {
      const res = await api.post('/expenses', data);
      return res.data;
    } catch {
      const newExp: Expense = {
        id: `exp-${Date.now()}`,
        category: data.category || 'Other',
        description: data.description || 'Farm operational cost',
        amount: data.amount || 100.0,
        date: data.date || new Date().toISOString().split('T')[0],
        fieldName: data.fieldName || 'General Farm',
        paymentMethod: data.paymentMethod || 'Bank Transfer',
      };
      MOCK_EXPENSES.unshift(newExp);
      return newExp;
    }
  },

  addIncome: async (data: Partial<Income>): Promise<Income> => {
    try {
      const res = await api.post('/income', data);
      return res.data;
    } catch {
      const newInc: Income = {
        id: `inc-${Date.now()}`,
        cropName: data.cropName || 'Tomato',
        buyer: data.buyer || 'Local Distributor',
        amount: data.amount || 1000.0,
        quantityTons: data.quantityTons || 2.0,
        date: data.date || new Date().toISOString().split('T')[0],
        invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
      };
      MOCK_INCOMES.unshift(newInc);
      return newInc;
    }
  },
};
