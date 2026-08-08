import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : 'https://notehub-api.goit.study';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
