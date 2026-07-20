import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://goit.global';

export async function GET(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';

  try {
    const response = await axios.get(`${BACKEND_URL}/users/me`, {
      headers: { Cookie: cookie },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { message: axiosError.response?.data?.message || 'Failed to fetch user' },
      { status: axiosError.response?.status || 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  const body = await request.json().catch(() => ({}));

  try {
    const response = await axios.patch(`${BACKEND_URL}/users/me`, body, {
      headers: { Cookie: cookie },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { message: axiosError.response?.data?.message || 'Failed to update user' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
