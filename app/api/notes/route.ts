import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://goit.global';

export async function GET(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  const { searchParams } = new URL(request.url);

  try {
    const response = await axios.get(`${BACKEND_URL}/notes`, {
      headers: { Cookie: cookie },
      params: Object.fromEntries(searchParams.entries()),
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { message: axiosError.response?.data?.message || 'Failed to fetch notes' },
      { status: axiosError.response?.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const cookie = request.headers.get('cookie') || '';
  const body = await request.json().catch(() => ({}));

  try {
    const response = await axios.post(`${BACKEND_URL}/notes`, body, {
      headers: { Cookie: cookie },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { message: axiosError.response?.data?.message || 'Failed to create note' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
