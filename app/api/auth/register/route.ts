import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../../../lib/api/api';
import { parseSetCookie } from '../../../../lib/utils/cookies';

export async function POST(request: Request) {
  console.log('API PROXY: Starting registration request');
  try {
    const body = await request.json().catch(() => ({}));
    const response = await api.post('/auth/register', body);
    const res = NextResponse.json(response.data);

    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      const cookieStore = await cookies();
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
    const errorMessage = err.response?.data?.message || err.message || 'Registration error';
    return NextResponse.json({ message: errorMessage }, { status: err.response?.status || 500 });
  }
}
