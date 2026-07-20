import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const BACKEND_URL = 'https://goit.global';

interface NoteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: NoteParams) {
  const { id } = await params;
  const cookie = request.headers.get('cookie') || '';

  try {
    const response = await axios.get(`${BACKEND_URL}/notes/${id}`, {
      headers: { Cookie: cookie },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { message: axiosError.response?.data?.message || 'Failed to fetch note' },
      { status: axiosError.response?.status || 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: NoteParams) {
  const { id } = await params;
  const cookie = request.headers.get('cookie') || '';

  try {
    const response = await axios.delete(`${BACKEND_URL}/notes/${id}`, {
      headers: { Cookie: cookie },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { message: axiosError.response?.data?.message || 'Failed to delete note' },
      { status: axiosError.response?.status || 500 }
    );
  }
}
