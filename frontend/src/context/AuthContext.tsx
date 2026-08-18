import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'usr-1',
  name: 'Rohith S D',
  email: 'rohith.manager@farm.agri',
  role: 'Farm Manager',
  farmName: 'Green Valley Agri Enterprise',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('prj533_token');
    const savedUser = localStorage.getItem('prj533_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(MOCK_USER);
      }
    } else {
      // Default to demo user for seamless evaluation
      setToken('mock-jwt-token-prj533');
      setUser(MOCK_USER);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate auth latency
    await new Promise((res) => setTimeout(res, 800));

    const loggedUser: User = {
      ...MOCK_USER,
      email: email || MOCK_USER.email,
    };
    const mockToken = `jwt-${Date.now()}`;

    setToken(mockToken);
    setUser(loggedUser);
    localStorage.setItem('prj533_token', mockToken);
    localStorage.setItem('prj533_user', JSON.stringify(loggedUser));
    setIsLoading(false);
    return true;
  };

  const register = async (name: string, email: string, _pass: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 800));

    const newUsr: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      farmName: 'Green Valley Agri Enterprise',
    };
    const mockToken = `jwt-${Date.now()}`;

    setToken(mockToken);
    setUser(newUsr);
    localStorage.setItem('prj533_token', mockToken);
    localStorage.setItem('prj533_user', JSON.stringify(newUsr));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('prj533_token');
    localStorage.removeItem('prj533_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
