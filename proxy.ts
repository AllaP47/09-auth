import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPrivateRoute) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (!accessToken && refreshToken) {
      try {
        console.log('PROXY: Access token expired, attempting session refresh via refreshToken');
        const response = await checkSession();

        // ВИПРАВЛЕНО: Перевіряємо статус відповіді Axios та наявність даних користувача в response.data
        if (!response || response.status !== 200 || !response.data || !response.data.email) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }

        console.log('PROXY: Session refreshed successfully');
      } catch (error) {
        console.error('PROXY ERROR: Session refresh failed', error);
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  if (isPublicRoute && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
