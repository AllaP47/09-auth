import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getMe } from '../../../lib/api/serverApi';
import css from './Profile.module.css';


export const metadata: Metadata = {
  title: 'Profile Page | NoteHub',
  description: 'Особистий кабінет користувача в застосунку NoteHub.',
  openGraph: {
    title: 'Profile Page | NoteHub',
    description: 'Особистий кабінет користувача в застосунку NoteHub.',
    url: 'https://notehub.com',
    images: [
      {
        url: 'https://goit.global',
        width: 1200,
        height: 630,
        alt: 'NoteHub - Сторінка профілю',
      },
    ],
  },
};


export default async function ProfilePage() {

  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        
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
        
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
