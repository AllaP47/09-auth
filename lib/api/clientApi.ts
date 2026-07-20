import { api } from './api';
import { User } from '../../types/user';

export * from './notes';

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
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const updateMe = async (userData: Partial<User>): Promise<User> => {
  const { data } = await api.patch('/auth/me', userData);
  return data;
};
