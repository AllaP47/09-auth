import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NoteDraft {
  title: string;
  content: string;
  tag: string;
}

export interface NoteStore {
  draft: NoteDraft;
  _hasHydrated: boolean;
  setDraft: (updatedFields: Partial<NoteDraft>) => void;
  clearDraft: () => void;
  setHasHydrated: (state: boolean) => void;
}

const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteStore>()(
  persist(
    set => ({
      draft: initialDraft,
      _hasHydrated: false,
      setDraft: (updatedFields: Partial<NoteDraft>) =>
        set((state: NoteStore) => ({
          draft: { ...state.draft, ...updatedFields },
        })),
      clearDraft: () => set({ draft: initialDraft }),
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'notehub-draft-storage',
      partialize: (state: NoteStore) => ({ draft: state.draft }),
      onRehydrateStorage: () => (state: NoteStore | undefined) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
