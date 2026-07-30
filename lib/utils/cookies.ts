import axios from 'axios';

export function parseSetCookie(setCookieHeader: string): Record<string, string> {
  const parts = setCookieHeader.split(';');
  const [nameValue] = parts;
  const [name, value] = nameValue.split('=');
  return { name: name.trim(), value: value.trim() };
}

export function logErrorResponse(error: unknown, contextName: string) {
  if (axios.isAxiosError(error)) {
    console.error(
      `API PROXY ERROR [${contextName}]: Status ${error.response?.status}, Message: ${error.response?.data?.message || error.message}`
    );
  } else {
    console.error(`API PROXY ERROR [${contextName}]: Generic error`, error);
  }
}
