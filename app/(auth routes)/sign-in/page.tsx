'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../../lib/api/clientApi';
import { useAuthStore } from '../../../lib/store/authStore';
import { User } from '../../../types/user';
import css from './SignIn.module.css';

interface LoginError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function SignInPage() {
  const router = useRouter();
  
  const setUser = useAuthStore((state: { setUser: (user: User) => void }) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userData = await login({ email, password });
      setUser(userData);
      router.push('/profile');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as LoginError;
        setError(axiosError.response?.data?.message || 'Log in failed');
      } else {
        setError('Log in failed');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>
        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>Log in</button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}

