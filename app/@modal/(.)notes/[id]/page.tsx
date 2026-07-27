import React from 'react';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreviewClient from './NotePreview.client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoteModalPage({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();

  try {
    // Попередньо завантажуємо дані нотатки на сервері за допомогою prefetchQuery
    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id),
    });
  } catch (error) {
    console.error('Modal SSR Prefetch Error:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* ВИПРАВЛЕНО: Передаємо id як проп, щоб задовольнити NotePreviewClientProps */}
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
