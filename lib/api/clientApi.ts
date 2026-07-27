import { api } from './api';
import { Note } from '../../types/note';
import { User } from '../../types/user';

// ТЗ вимагає: Типи та інтерфейси для запитів описуються у файлах, де вони використовуються
interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export const fetchNotes = async (params?: FetchNotesParams): Promise<Note[]> => {
  const { data } = await api.get('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const { data } = await api.post('/notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};

export const register = async (credentials: { email: string; password: string }): Promise<User> => {
  const { data } = await api.post('/auth/register', credentials);
  return data;
};

export const login = async (credentials: { email: string; password: string }): Promise<User> => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get('/auth/session');
  return data || null;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/users/me');
  return data;
};

export const updateMe = async (userData: { username: string }): Promise<User> => {
  const { data } = await api.patch('/users/me', userData);
  return data;
};
