'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../../../../lib/api/clientApi';
import { NoteList } from '../../../../../components/NoteList/NoteList';
import { SearchBox } from '../../../../../components/SearchBox/SearchBox';
import { Pagination } from '../../../../../components/Pagination/Pagination';
import type { Note } from '../../../../../types/note';

import cssStyles from '../../notes.module.css';

const css = (cssStyles || {}) as Record<string, string>;

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag = 'all' }: NotesClientProps) {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const perPage = 12;

  
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };


  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, search, tag }],
    queryFn: () => fetchNotes({ page, perPage, search, tag }),
    placeholderData: keepPreviousData,
  });


const responseData = data as unknown as { notes: Note[]; totalPages: number } | undefined;

  const notesList = responseData?.notes || [];
  const totalPages = responseData?.totalPages || 1;

  if (isLoading && notesList.length === 0) {
    return <p style={{ padding: '20px', textAlign: 'center' }}>Loading notes...</p>;
  }

  if (isError) {
    return <p style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>Failed to load notes.</p>;
  }

  return (
    <div className={css.container || ''}>
      <div className={css.actionsBar || ''}>
        <SearchBox onChange={handleSearchChange} />
        
     
        <Link href="/notes/action/create" className={css.createLink || ''}>
          Create Note
        </Link>
      </div>

      {notesList.length > 0 ? (
        <>
          <NoteList notes={notesList} />
          {totalPages > 1 && (
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={(p: number) => setPage(p)} 
            />
          )}
        </>
      ) : (
        <p style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
          No notes found matching your criteria.
        </p>
      )}
    </div>
  );
}



