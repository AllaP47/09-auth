import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { api } from '../../../../lib/api/api';
import { parseSetCookie, logErrorResponse } from '../../../../lib/utils/cookies';

export async function GET() {
  console.log('API PROXY: Starting check session request');

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // ВИПРАВЛЕНО: Перевіряємо наявність кук до виконання API-запиту, щоб повернути пусту відповідь 200, якщо користувач неавторизований
    if (!accessToken && !refreshToken) {
      console.log('API PROXY: No active session tokens found in store');
      return new NextResponse(null, { status: 200 });
    }

    const cookieString = cookieStore.toString();
    const response = await api.get('/auth/session', {
      headers: { Cookie: cookieString },
    });

    const res = NextResponse.json(response.data);

    // Повторно використовуємо однакову логіку парсингу масиву заголовків set-cookie
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      cookiesArray.forEach(cookieStr => {
        const { name, value, options } = parseSetCookie(cookieStr.toString());
        cookieStore.set(name, value, options);
      });
    }

    return res;
  } catch (error: unknown) {
    logErrorResponse(error, 'Session Route Handler');
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Session error' }, { status: 500 });
  }
}
