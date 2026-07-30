import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { api } from '../../../../lib/api/api';
import { parseSetCookie, logErrorResponse } from '../../../../lib/utils/cookies';

export async function POST(request: Request) {
  console.log('API PROXY: Starting registration request');

  try {
    const body = await request.json().catch(() => ({}));
    const response = await api.post('/auth/register', body);

    const res = NextResponse.json(response.data);

    // ВИПРАВЛЕНО: Обробляємо декілька заголовків set-cookie і парсимо їх окремо
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      const cookieStore = await cookies();
      const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

      cookiesArray.forEach(cookieStr => {
        const { name, value, options } = parseSetCookie(cookieStr.toString());
        // Зберігаємо оригінальні атрибути cookie з відповіді бекенду
        cookieStore.set(name, value, options);
      });
    }

    return res;
  } catch (error: unknown) {
    logErrorResponse(error, 'Register Route Handler');
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Registration error' }, { status: 500 });
  }
}
