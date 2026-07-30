import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../../../lib/api/api';
import { parseSetCookie } from '../../../../lib/utils/cookies';

export async function GET() {
  console.log('API PROXY: Starting check session request');
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const response = await api.get('/auth/session', { headers: { Cookie: cookieString } });
    const res = NextResponse.json(response.data);

    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      const cookieData = parseSetCookie(setCookieHeader.toString());
      cookieStore.set(cookieData.name, cookieData.value, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
    }
    return res;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    const errorMessage = err.response?.data?.message || err.message || 'Session error';
    return NextResponse.json({ message: errorMessage }, { status: err.response?.status || 500 });
  }
}
