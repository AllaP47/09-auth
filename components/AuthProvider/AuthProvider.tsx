'use client';

import React, { useEffect, useState } from 'react';
import { checkSession } from '../../lib/api/clientApi';
import { useAuthStore } from '../../lib/store/authStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore((state) => state.clearIsAuthenticated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
       
        const userData = await checkSession();
        
        if (userData && typeof userData === 'object' && userData.email) {
          setUser(userData); 
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
