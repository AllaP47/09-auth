import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { api } from '../../../../lib/api/api';
import { logErrorResponse } from '../../../../lib/utils/cookies';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  console.log(`API PROXY: Fetching note details for ID ${id}`);

  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await api.get(`/notes/${id}`, {
      headers: { Cookie: cookieString },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error, 'Fetch Note By ID');
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  console.log(`API PROXY: Deleting note with ID ${id}`);

  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await api.delete(`/notes/${id}`, {
      headers: { Cookie: cookieString },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error, 'Delete Note');
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Failed to delete note' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  console.log(`API PROXY: Updating note with ID ${id}`);

  try {
    const body = await request.json().catch(() => ({}));
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await api.patch(`/notes/${id}`, body, {
      headers: {
        Cookie: cookieString,
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    logErrorResponse(error, 'Update Note PATCH');
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Failed to update note' }, { status: 500 });
  }
}
