import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { api } from '../../../lib/api/api';
import { logErrorResponse } from '../../../lib/utils/cookies';

export async function GET(request: NextRequest) {
  console.log('API PROXY: Fetching notes list with strict parameters parsing');
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '12', 10);
  const search = searchParams.get('search') || '';
  const rawTag = searchParams.get('tag') || 'all';

  const tag = rawTag === 'all' ? '' : rawTag;

  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await api.get('/notes', {
      headers: { Cookie: cookieString },
      params: { page, perPage, search, tag },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error, 'Fetch Notes List GET');
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('API PROXY: Creating new note with json content-type header');

  try {
    const body = await request.json().catch(() => ({}));
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await api.post('/notes', body, {
      headers: {
        Cookie: cookieString,
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error, 'Create Note POST');
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Failed to create note' }, { status: 500 });
  }
}
