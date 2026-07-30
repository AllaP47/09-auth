'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '../../../../lib/store/authStore';
import { updateMe } from '../../../../lib/api/clientApi';
import css from './EditProfile.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  

  const [username, setUsername] = useState<string>(user?.username || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!user) {
    return null; 
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);

    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser); 
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update username:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        
        <div className={css.avatarWrapper}>
          <Image 
            src={user.avatar} 
            alt="User Avatar" 
            width={120} 
            height={120} 
            className={css.avatar}
            priority
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input 
              id="username" 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={css.input}
              disabled={isLoading}
              required
            />
          </div>
          
          <p>Email: {user.email}</p>
          
          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => router.push('/profile')} className={css.cancelButton} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
