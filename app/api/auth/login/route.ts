import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { parseSetCookie } from '../../../../lib/utils/cookies';

const BACKEND_URL = 'https://goit.global';

export async function POST(request: Request) {
  console.log('API PROXY: Starting login request');

  try {
    const body = await request.json().catch(() => ({}));
    console.log('API PROXY: Request body parsed successfully');

    const response = await axios.post(`${BACKEND_URL}/auth/login`, body);
    console.log('API PROXY: Backend response received status', response.status);

    const res = NextResponse.json(response.data);

    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      console.log('API PROXY: Setting authorization session cookie');
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
    console.error('API PROXY ERROR: Login failed');

    const axiosError = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };

    const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Login error';
    const errorStatus = axiosError.response?.status || 500;

    console.error(`API PROXY ERROR: Status ${errorStatus}, Message: ${errorMessage}`);

    return NextResponse.json({ message: errorMessage }, { status: errorStatus });
  }
}
