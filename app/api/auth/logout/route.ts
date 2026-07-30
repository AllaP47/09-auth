import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../../../lib/api/api';

export async function POST() {
  console.log('API PROXY: Starting logout request');
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();
    const response = await api.post('/auth/logout', {}, { headers: { Cookie: cookieString } });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    const errorMessage = err.response?.data?.message || err.message || 'Logout error';
    return NextResponse.json({ message: errorMessage }, { status: err.response?.status || 500 });
  }
}
