import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://goit.global';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  try {
    const response = await axios.post(`${BACKEND_URL}/auth/register`, body);
    const res = NextResponse.json(response.data);

    if (response.headers['set-cookie']) {
      res.headers.set('set-cookie', response.headers['set-cookie'].toString());
    }
    return res;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { message: axiosError.response?.data?.message || 'Registration error' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
