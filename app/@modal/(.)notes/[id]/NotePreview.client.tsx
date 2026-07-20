'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { fetchNoteById } from '../../../../lib/api/notes';
import { Modal } from '@/components/Modal/Modal';

import cssStyles from '@/app/notes/[id]/details.module.css';
const css = (cssStyles || {}) as Record<string, string>;


interface NotePreviewClientProps {
  id: string;
};

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div className={css.container || ''} style={{ minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {isLoading && (
          <p style={{ textAlign: 'center', color: '#666', fontWeight: '500' }}>
            Loading note details...
          </p>
        )}

        {isError && (
          <p style={{ textAlign: 'center', color: '#dc3545', fontWeight: '500' }}>
            Failed to load note details. Please try again.
          </p>
        )}

        {!isLoading && !isError && note && (
          <>
            <h2 className={css.title || ''}>{note.title}</h2>
            <p className={css.content || ''}>{note.content}</p>
            {note.tag && (
              <div className={css.tagWrapper || ''} style={{ marginTop: '15px' }}>
                <span className={css.tag || ''} style={{ background: '#e0e0e0', padding: '4px 10px', borderRadius: '4px', fontSize: '14px' }}>
                  {note.tag}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

