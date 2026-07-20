'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce'; 

import { fetchNotes } from '../../../../lib/api/notes';
import { NoteList } from '../../../../components/NoteList/NoteList';
import { SearchBox } from '../../../../components/SearchBox/SearchBox';
import { Pagination } from '../../../../components/Pagination/Pagination';
import type { FetchNotesResponse } from '../../../../types/note';

import cssStyles from '../../notes.module.css';
const css = (cssStyles || {}) as Record<string, string>;

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 12;

  const { data, isLoading } = useQuery({
    queryKey: ['notes', { page, search, tag }],
    queryFn: () => fetchNotes({ page, perPage, search, tag }),
    placeholderData: (previousData: FetchNotesResponse | undefined) => previousData,
    refetchOnMount: false,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); 
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={(e) => debouncedSearch(e.target.value)} />
        {data && data.totalPages > 1 && (
          <Pagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      <main style={{ minHeight: '300px', position: 'relative' }}>
        {isLoading && <p style={{ textAlign: 'center' }}>Loading notes...</p>}
        {!isLoading && data && data.notes.length > 0 && <NoteList notes={data.notes} />}
        {!isLoading && data && data.notes.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>No notes found.</p>
        )}
      </main>
    </div>
  );
}


