import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { fetchNoteById } from '../../../../lib/api/notes'; 
import NotePreviewClient from './NotePreview.client';


interface ParamProps {
  params: Promise<{
    id: string;
  }>;
}

// ВИПРАВЛЕНО рядок 11: змінено назву функції на NotePreview, щоб не було дублювання з NotePreviewClient
export default async function NotePreview({ params }: ParamProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
