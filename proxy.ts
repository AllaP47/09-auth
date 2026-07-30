import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';
import { parseSetCookie } from 'cookie';

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
        console.log('PROXY: Access token expired, attempting session refresh via checkSession');
        const sessionResponse = await checkSession();

        if (
          !sessionResponse ||
          sessionResponse.status !== 200 ||
          !sessionResponse.data ||
          !sessionResponse.data.success
        ) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }

        console.log('PROXY: Session refreshed successfully on backend');
        const response = NextResponse.next();
        const setCookieHeader = sessionResponse.headers['set-cookie'];

        if (setCookieHeader) {
          console.log('PROXY: Extracting and injecting new tokens into outbound response stream');
          const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

          cookiesArray.forEach(cookieStr => {
            const parsed = parseSetCookie(cookieStr.toString());

            if (parsed.name) {
              response.cookies.set(parsed.name, parsed.value || '', {
                path: parsed.path || '/',
                domain: parsed.domain || undefined,

                expires: parsed.expires ? new Date(parsed.expires) : undefined,
                maxAge: parsed.maxAge,
                sameSite: parsed.sameSite as 'strict' | 'lax' | 'none' | undefined,
                secure: process.env.NODE_ENV === 'production',
                httpOnly: parsed.httpOnly,
              });
            }
          });
        }

        return response;
      } catch {
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
