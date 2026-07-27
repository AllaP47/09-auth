import React from 'react';
import type { Metadata } from 'next';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await fetchNoteById(id);
    const pageUrl = `https://notehub.com{id}`;

    return {
      title: `${note.title} | NoteHub`,
      description: note.content || '',
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content || '',
        url: pageUrl,
        images: [
          {
            url: 'https://goit.global',
            width: 1200,
            height: 630,
            alt: `Note: ${note.title}`,
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Note not found | NoteHub',
      description: 'Запитувана нотатка не знайдена.',
      openGraph: {
        title: 'Note not found | NoteHub',
        description: 'Запитувана нотатка не знайдена.',
        url: `https://notehub.com{id}`,
        images: [
          {
            url: 'https://goit.global',
            width: 1200,
            height: 630,
            alt: 'Note not found',
          },
        ],
      },
    };
  }
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;

 
  const queryClient = new QueryClient();

  try {
    
    await queryClient.prefetchQuery({
      queryKey: ['note', id],
      queryFn: () => fetchNoteById(id),
    });
  } catch (error) {
    console.error('SSR Prefetch Error:', error);
  }

  return (
    
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

