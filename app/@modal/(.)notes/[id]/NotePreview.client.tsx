'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; 
import { fetchNoteById } from '@/lib/api/clientApi';
import { Modal } from '@/components/Modal/Modal';
import cssStyles from '@/app/(private routes)/notes/[id]/details.module.css';

const css = (cssStyles || {}) as Record<string, string>;

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
  
      <Modal isOpen={true} onClose={handleClose}>
        <p style={{ padding: '20px', textAlign: 'center' }}>Loading preview...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
    
      <Modal isOpen={true} onClose={handleClose}>
        <p style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>Something went wrong.</p>
      </Modal>
    );
  }

  const formattedDate = note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'No date available';

  return (
  
    <Modal isOpen={true} onClose={handleClose}>
      <div className={css.container || ''} style={{ position: 'relative', padding: '20px' }}>
        
        <button 
          type="button" 
          onClick={handleClose} 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333'
          }}
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className={css.item || ''}>
          <div className={css.header || ''}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag || ''}>{note.tag}</p>
          <p className={css.content || ''}>{note.content}</p>
          <p className={css.date || ''}>
            Created date: {formattedDate}
          </p>
        </div>
      </div>
    </Modal>
  );
}


