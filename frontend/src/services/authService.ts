import api from './api';
import { User, UserRole } from '../types';

export const authService = {
  login: async (email: string, pass: string): Promise<{ user: User; token: string }> => {
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      return res.data;
    } catch {
      // Fallback mock response when server is offline
      return {
        user: {
          id: 'usr-1',
          name: 'Rohith S D',
          email,
          role: 'Farm Manager',
          farmName: 'Green Valley Agri Enterprise',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        },
        token: 'mock-jwt-token-prj533',
      };
    }
  },

  register: async (name: string, email: string, pass: string, role: UserRole): Promise<{ user: User; token: string }> => {
    try {
      const res = await api.post('/auth/register', { name, email, password: pass, role });
      return res.data;
    } catch {
      return {
        user: {
          id: `usr-${Date.now()}`,
          name,
          email,
          role,
          farmName: 'Green Valley Agri Enterprise',
        },
        token: `jwt-${Date.now()}`,
      };
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch {
      return {
        id: 'usr-1',
        name: 'Rohith S D',
        email: 'rohith.manager@farm.agri',
        role: 'Farm Manager',
        farmName: 'Green Valley Agri Enterprise',
      };
    }
  },
};
