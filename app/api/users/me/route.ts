import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../../../lib/api/api';
import { logErrorResponse } from '../../../../lib/utils/cookies';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('API PROXY: Starting fetch profile request');
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const response = await api.get('/users/me', { headers: { Cookie: cookieString } });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error, 'Get Profile');
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch user';
    return NextResponse.json({ message: errorMessage }, { status: err.response?.status || 500 });
  }
}

export async function PATCH(request: NextRequest) {
  console.log('API PROXY: Starting update profile request');
  try {
    const body = await request.json().catch(() => ({}));
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const response = await api.patch('/users/me', body, { headers: { Cookie: cookieString } });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error, 'Update Profile');
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    const errorMessage = err.response?.data?.message || err.message || 'Failed to update user';
    return NextResponse.json({ message: errorMessage }, { status: err.response?.status || 500 });
  }
}
