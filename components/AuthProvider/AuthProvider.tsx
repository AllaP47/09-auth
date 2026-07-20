'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../app/api/api';
import { useAuthStore } from '../../lib/store/authStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Робимо прямий запит до сесії, яка повертає користувача або порожній статус 200
        const { data } = await api.get('/auth/session');
        
        if (data && typeof data === 'object' && data.email) {
          setUser(data); // Тіло не порожнє — користувач успішно авторизований
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setIsReady(true);
      }
    };
    initAuth();
  }, [setUser, clearIsAuthenticated]);

  if (!isReady) return null;

  return <>{children}</>;
};
