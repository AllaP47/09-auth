import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { api } from '../../../../lib/api/api';
import { logErrorResponse } from '../../../../lib/utils/cookies';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('API PROXY: Starting fetch profile request');

  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await api.get('/users/me', {
      headers: { Cookie: cookieString },
    });
    console.log('API PROXY: Backend fetch profile response received status', response.status);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error, 'Get Profile GET');

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  console.log('API PROXY: Starting update profile request');

  try {
    const body = await request.json().catch(() => ({}));
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await api.patch('/users/me', body, {
      headers: { Cookie: cookieString },
    });
    console.log('API PROXY: Backend update profile response received status', response.status);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error, 'Update Profile PATCH');

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}
