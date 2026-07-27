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

// 1. ВИПРАВЛЕНО: Функція fetchNotes тепер підтримує об'єкт параметрів (пошук, пагінація, теги)
export const fetchNotes = async (params?: FetchNotesParams): Promise<Note[]> => {
  const { data } = await api.get('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

// 2. ВИПРАВЛЕНО: Замість Partial<Note> вказано конкретні обов'язкові поля для створення нотатки
export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const { data } = await api.post('/notes', noteData);
  return data;
};

// 3. ВИПРАВЛЕНО: Функція deleteNote тепер повертає об'єкт видаленої нотатки, а не void
export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};

// 4. ВИПРАВЛЕНО: Функції register та login приймають тільки email та password замість загального Record
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

// 5. ВИПРАВЛЕНО: Функція checkSession тепер повертає фактичні дані відповіді з бекенду (User або порожню відповідь)
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
