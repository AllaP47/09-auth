import { api } from '../../app/api/api';
import { Note } from '../../types/note';
import { User } from '../../types/user';

export const fetchNotes = async (): Promise<Note[]> => {
  const { data } = await api.get('/notes');
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

export const createNote = async (noteData: Partial<Note>): Promise<Note> => {
  const { data } = await api.post('/notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

export const register = async (credentials: Record<string, string>): Promise<User> => {
  const { data } = await api.post('/auth/register', credentials);
  return data;
};

export const login = async (credentials: Record<string, string>): Promise<User> => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<{ valid: boolean }> => {
  const { data } = await api.get('/auth/session');
  return { valid: !!data && typeof data === 'object' };
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/users/me');
  return data;
};

export const updateMe = async (userData: Partial<User>): Promise<User> => {
  const { data } = await api.patch('/users/me', userData);
  return data;
};
