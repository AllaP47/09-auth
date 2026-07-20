import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://goit.global';

export async function GET(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';

  try {
    const response = await axios.get(`${BACKEND_URL}/auth/session`, {
      headers: { Cookie: cookie },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { message: axiosError.response?.data?.message || 'Session error' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
