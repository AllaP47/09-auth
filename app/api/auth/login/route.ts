import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { api } from '../../../../lib/api/api';
import { parseSetCookie, logErrorResponse } from '../../../../lib/utils/cookies';

export async function POST(request: Request) {
  console.log('API PROXY: Starting login request');

  try {
    const body = await request.json().catch(() => ({}));
    const response = await api.post('/auth/login', body);

    const res = NextResponse.json(response.data);

    // ВИПРАВЛЕНО: Обробляємо кілька кук окремо та копіюємо їх оригінальні атрибути
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      const cookieStore = await cookies();
      const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

      cookiesArray.forEach(cookieStr => {
        const { name, value, options } = parseSetCookie(cookieStr.toString());
        cookieStore.set(name, value, options);
      });
    }

    return res;
  } catch (error: unknown) {
    logErrorResponse(error, 'Login Route Handler');
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Login error' }, { status: 500 });
  }
}
