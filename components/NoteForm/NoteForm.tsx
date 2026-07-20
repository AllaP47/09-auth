'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api/notes';
import { useNoteStore, type NoteStore } from '../../lib/store/noteStore';
import type { NoteTagType } from '../../types/note';

import cssStyles from './NoteForm.module.css';
const css = (cssStyles || {}) as Record<string, string>;

export const NoteForm: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state: NoteStore) => state.draft);
  const setDraft = useNoteStore((state: NoteStore) => state.setDraft);
  const clearDraft = useNoteStore((state: NoteStore) => state.clearDraft);
  const isHydrated = useNoteStore((state: NoteStore) => state._hasHydrated);

  const createMutation = useMutation({
    mutationFn: (newNote: { title: string; content: string; tag: NoteTagType }) => createNote(newNote),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate({
      title: draft.title,
      content: draft.content,
      tag: draft.tag as NoteTagType,
    });
  };

  if (!isHydrated) return null;

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          required
          placeholder="Enter note title..."
          defaultValue={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          required
          placeholder="Write your note here..."
          defaultValue={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          required
          defaultValue={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value })}
        >
          {['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button 
          type="button" 
          className={css.cancelButton} 
          onClick={() => router.back()}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className={css.submitButton} 
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};



