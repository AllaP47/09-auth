import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../../lib/api/api';

export async function GET(request: NextRequest) {
  console.log('API PROXY: Fetching notes list');
  const { searchParams } = new URL(request.url);
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const response = await api.get('/notes', {
      headers: { Cookie: cookieString },
      params: Object.fromEntries(searchParams.entries()),
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch notes';
    return NextResponse.json({ message: errorMessage }, { status: err.response?.status || 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('API PROXY: Creating new note');
  try {
    const body = await request.json().catch(() => ({}));
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const response = await api.post('/notes', body, { headers: { Cookie: cookieString } });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    const errorMessage = err.response?.data?.message || err.message || 'Failed to create note';
    return NextResponse.json({ message: errorMessage }, { status: err.response?.status || 500 });
  }
}
