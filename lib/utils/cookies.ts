import axios from 'axios';

export interface ParsedCookie {
  name: string;
  value: string;
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
    maxAge?: number;
    expires?: Date;
  };
}

export function parseSetCookie(cookieStr: string): ParsedCookie {
  const parts = cookieStr.split(';').map(p => p.trim());
  const [nameValue] = parts;
  const [name, value] = nameValue.split('=');

  const options: ParsedCookie['options'] = { path: '/' };

  parts.slice(1).forEach(part => {
    const [key, val] = part.split('=');
    const lowerKey = key.toLowerCase();

    if (lowerKey === 'httponly') options.httpOnly = true;
    if (lowerKey === 'secure') options.secure = true;
    if (lowerKey === 'max-age') options.maxAge = parseInt(val, 10);
    if (lowerKey === 'path') options.path = val;
    if (lowerKey === 'samesite') {
      const s = val.toLowerCase();
      if (s === 'strict' || s === 'lax' || s === 'none') {
        options.sameSite = s;
      }
    }
  });

  return { name: name.trim(), value: value.trim(), options };
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
