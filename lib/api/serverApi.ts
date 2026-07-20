import { cookies } from 'next/headers';
import axios from 'axios';
import { User } from '../../types/user';
import { Note } from '../../types/note';

const baseURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/api';

// Функція для збору кук на сервері
const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getAuthHeaders();
  const { data } = await axios.get(`${baseURL}/notes/${id}`, headers);
  return data;
};

export const fetchNotes = async (): Promise<Note[]> => {
  const headers = await getAuthHeaders();
  const { data } = await axios.get(`${baseURL}/notes`, headers);
  return data;
};

export const getMe = async (): Promise<User> => {
  const headers = await getAuthHeaders();
  const { data } = await axios.get(`${baseURL}/auth/me`, headers);
  return data;
};

export const checkSession = async (): Promise<{ valid: boolean }> => {
  const headers = await getAuthHeaders();
  const { data } = await axios.get(`${baseURL}/auth/session`, headers);
  return data;
};
