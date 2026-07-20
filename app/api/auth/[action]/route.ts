import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://goit.global';

interface RouteParams {
  params: Promise<{ action: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { action } = await params;
  const body = await request.json().catch(() => ({}));
  const cookie = request.headers.get('cookie') || '';

  try {
    const response = await axios.post(`${BACKEND_URL}/auth/${action}`, body, {
      headers: { Cookie: cookie },
    });

    const res = NextResponse.json(response.data);
    if (response.headers['set-cookie']) {
      res.headers.set('set-cookie', response.headers['set-cookie'].toString());
    }
    return res;
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { message: axiosError.response?.data?.message || 'Auth error' },
      { status: axiosError.response?.status || 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { action } = await params;
  if (action !== 'session') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

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
