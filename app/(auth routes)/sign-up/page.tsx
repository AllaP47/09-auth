'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../../lib/api/clientApi';
import { useAuthStore } from '../../../lib/store/authStore';
import { User } from '../../../types/user';
import css from './SignUp.module.css';

interface RegisterError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function SignUpPage() {
  const router = useRouter();
  
  // Отримуємо метод setUser із Zustand-стора
  const setUser = useAuthStore((state: { setUser: (user: User) => void }) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const userData = await register({ email, password });
      
      // ЛОГІКА ЗБЕРЕЖЕННЯ: Записуємо дані користувача в Zustand після успішної реєстрації
      setUser(userData);
      
      // Автоматичний редірект на сторінку профілю
      router.push('/profile');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as RegisterError;
        setError(axiosError.response?.data?.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>
        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>Register</button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}

