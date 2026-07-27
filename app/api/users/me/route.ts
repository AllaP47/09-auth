import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://goit.global';

export async function GET(request: NextRequest) {
  console.log('API PROXY: Starting fetch profile request');
  const cookie = request.headers.get('cookie') || '';

  try {
    const response = await axios.get(`${BACKEND_URL}/users/me`, {
      headers: { Cookie: cookie },
    });
    console.log('API PROXY: Backend fetch profile response received status', response.status);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('API PROXY ERROR: Fetching profile failed');

    const axiosError = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };

    const errorMessage =
      axiosError.response?.data?.message || axiosError.message || 'Failed to fetch user';
    const errorStatus = axiosError.response?.status || 500;

    console.error(`API PROXY ERROR: Status ${errorStatus}, Message: ${errorMessage}`);

    return NextResponse.json({ message: errorMessage }, { status: errorStatus });
  }
}

export async function PATCH(request: NextRequest) {
  console.log('API PROXY: Starting update profile request');
  const cookie = request.headers.get('cookie') || '';

  try {
    const body = await request.json().catch(() => ({}));
    console.log('API PROXY: Update request body parsed successfully');

    const response = await axios.patch(`${BACKEND_URL}/users/me`, body, {
      headers: { Cookie: cookie },
    });
    console.log('API PROXY: Backend update profile response received status', response.status);
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error('API PROXY ERROR: Updating profile failed');

    const axiosError = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };

    const errorMessage =
      axiosError.response?.data?.message || axiosError.message || 'Failed to update user';
    const errorStatus = axiosError.response?.status || 500;

    console.error(`API PROXY ERROR: Status ${errorStatus}, Message: ${errorMessage}`);

    return NextResponse.json({ message: errorMessage }, { status: errorStatus });
  }
}
