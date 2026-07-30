import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { api } from '../../../../lib/api/api';
import { logErrorResponse } from '../../../../lib/utils/cookies';

export async function POST() {
  console.log('API PROXY: Starting logout request');

  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await api.post(
      '/auth/logout',
      {},
      {
        headers: { Cookie: cookieString },
      }
    );
    console.log('API PROXY: Backend logout response received status', response.status);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error, 'Logout Route Handler');
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Logout error' }, { status: 500 });
  }
}
