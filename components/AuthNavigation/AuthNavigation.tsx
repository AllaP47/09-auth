'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/authStore';
import { logout } from '../../lib/api/clientApi';
import css from './AuthNavigation.module.css';

export const AuthNavigation: React.FC = () => {
  const router = useRouter();
  

  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout(); 
      clearIsAuthenticated(); 
      router.push('/sign-in'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
    
      {isAuthenticated && user ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/profile" prefetch={false} className={css.navigationLink}>
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user.email}</p>
            <button type="button" onClick={handleLogout} className={css.logoutButton}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
              Register
            </Link>
          </li>
        </>
      )}
    </>
  );
};
