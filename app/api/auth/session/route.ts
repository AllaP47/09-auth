import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://goit.global';

export async function GET(request: NextRequest) {
  console.log('API PROXY: Starting check session request');
  const cookie = request.headers.get('cookie') || '';

  try {
    const response = await axios.get(`${BACKEND_URL}/auth/session`, {
      headers: { Cookie: cookie },
    });
    console.log('API PROXY: Backend session response received status', response.status);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('API PROXY ERROR: Session check failed');

    const axiosError = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };

    const errorMessage =
      axiosError.response?.data?.message || axiosError.message || 'Session error';
    const errorStatus = axiosError.response?.status || 500;

    console.error(`API PROXY ERROR: Status ${errorStatus}, Message: ${errorMessage}`);

    return NextResponse.json({ message: errorMessage }, { status: errorStatus });
  }
}
