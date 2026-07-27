'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  // ВИПРАВЛЕНО: Викликаємо оновлення роутера при монтуванні макета
  useEffect(() => {
    router.refresh();
  }, [router]);

  return <>{children}</>;
}

