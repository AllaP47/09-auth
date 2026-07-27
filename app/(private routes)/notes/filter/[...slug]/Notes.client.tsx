'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../../../../lib/api/clientApi';
import { NoteList } from '../../../../../components/NoteList/NoteList';
import { SearchBox } from '../../../../../components/SearchBox/SearchBox';
import { Pagination } from '../../../../../components/Pagination/Pagination';
import { Note } from '../../../../../types/note';
import cssStyles from '../../notes.module.css';

const css = (cssStyles || {}) as Record<string, string>;

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const perPage = 12;


  const { data: allNotes = [], isLoading, isError } = useQuery<Note[], Error>({
    queryKey: ['notes', { search, tag }],
    queryFn: () => fetchNotes({ search, tag: tag === 'all' ? undefined : tag }),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1); // Скидаємо на першу сторінку при пошуку
  };

  const totalNotes = allNotes.length;
  const totalPages = Math.ceil(totalNotes / perPage) || 1;


  const startIndex = (page - 1) * perPage;
  const displayedNotes = allNotes.slice(startIndex, startIndex + perPage);

  if (isLoading && allNotes.length === 0) {
    return <p style={{ padding: '20px', textAlign: 'center' }}>Loading notes...</p>;
  }

  if (isError) {
    return <p style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>Failed to load notes.</p>;
  }

  return (
    <div className={css.container || ''}>
      <div className={css.actionsBar || ''}>
        <SearchBox onChange={handleSearchChange} />
      </div>

      {displayedNotes.length > 0 ? (
        <>
          <NoteList notes={displayedNotes} />
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



