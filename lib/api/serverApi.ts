import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
import { api } from './api';
import { User } from '../../types/user';
import { Note } from '../../types/note';

// Повертаємо асинхронність та додаємо точні типи для усунення помилки 'any'
const getAuthHeaders = async () => {
  const cookieStore = await cookies(); // Використовуємо await, оскільки cookies() повертає Promise

  const cookieString = cookieStore
    .getAll()
    .map((cookie: { name: string; value: string }) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  return {
    headers: {
      Cookie: cookieString,
    },
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const config = await getAuthHeaders();
  const { data } = await api.get(`/notes/${id}`, config);
  return data;
};

export const fetchNotes = async (params?: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<Note[]> => {
  const config = await getAuthHeaders();
  const { data } = await api.get('/notes', { ...config, params });
  return data;
};

export const getMe = async (): Promise<User> => {
  const config = await getAuthHeaders();
  const { data } = await api.get('/users/me', config);
  return data;
};

export const checkSession = async (): Promise<AxiosResponse<User>> => {
  const config = await getAuthHeaders();
  const response = await api.get<User>('/auth/session', config);
  return response;
};
