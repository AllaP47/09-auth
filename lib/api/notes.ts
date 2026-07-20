import axios from 'axios';
import type { FetchNotesResponse, Note, NoteTagType } from '../../types/note';

interface FetchNotesParams {
  page: number;
  perPage: number;
  search: string;
  tag?: string;
}

interface CreateNoteInput {
  title: string;
  content: string;
  tag: NoteTagType;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>('/api/notes', {
    params: { page, perPage, search, tag },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/api/notes/${id}`);
  return response.data;
};

export const createNote = async (newNote: CreateNoteInput): Promise<Note> => {
  const response = await axios.post<Note>('/api/notes', newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete(`/api/notes/${id}`);
};
