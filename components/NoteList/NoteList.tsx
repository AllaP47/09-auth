'use client';

import React from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../lib/api/notes'; 
import type { Note } from '../../types/note';

import cssStyles from './NoteList.module.css';
const css = (cssStyles || {}) as Record<string, string>;

interface NoteListProps {
  notes: Note[];
}

export const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  if (notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag || 'Note'}</span>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link href={`/notes/${id}`} style={{ color: '#0d6efd', fontSize: '14px' }}>
                View details
              </Link>
              <button 
                className={css.button} 
                onClick={() => deleteMutation.mutate(id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? '...' : 'Delete'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
