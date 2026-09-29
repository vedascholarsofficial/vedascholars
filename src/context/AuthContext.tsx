'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (userData: any, tokenData: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUser = localStorage.getItem('user_data');
    
    // Fallback sync with Cookies in case of manual deletion to keep Middleware happy
    const cookieToken = Cookies.get('jwt_token');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      if (!cookieToken) {
         Cookies.set('jwt_token', storedToken, { expires: 30 }); // 30 days
      }
    } else if (cookieToken) {
      // Edge case: cookie exists but local storage is cleared
      setToken(cookieToken);
    }
  }, []);

  const login = (userData: any, tokenData: string) => {
    // 1. Context state update
    setUser(userData);
    setToken(tokenData);

    // 2. Set strict requirements
    localStorage.setItem('jwt_token', tokenData);
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    // 3. Set Cookie for NextJS Edge Middleware
    Cookies.set('jwt_token', tokenData, { expires: 30 }); 
  };

  const logout = () => {
    // Clear everything
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    Cookies.remove('jwt_token');
    
    // Force redirect native reload logic to clear all hooks
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
