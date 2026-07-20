import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://goit.global';

export async function POST(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';

  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/logout`,
      {},
      {
        headers: { Cookie: cookie },
      }
    );
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { message: axiosError.response?.data?.message || 'Logout error' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
