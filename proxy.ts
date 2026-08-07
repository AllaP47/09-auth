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

  // ВИПРАВЛЕНО: Суворіша перевірка маршрутів, щоб уникнути помилкових спрацювань на /notesX чи /profiled
  const isPrivateRoute = privateRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );
  const isPublicRoute = publicRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );

  // Сценарій 1: Обробка захищених ПРИВАТНИХ маршрутів
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

            // ВИПРАВЛЕНО: Безпечно перевіряємо, що parsed.name та parsed.value існують і є валідними
            if (parsed && parsed.name && parsed.value) {
              response.cookies.set(parsed.name, parsed.value, {
                path: parsed.path || '/',
                domain: parsed.domain || undefined,
                expires: parsed.expires ? new Date(parsed.expires) : undefined,
                maxAge: parsed.maxAge,
                sameSite: parsed.sameSite as 'strict' | 'lax' | 'none' | undefined,
                // ВИПРАВЛЕНО: Спочатку зберігаємо оригінальний атрибут secure від бекенду, якщо він є
                secure:
                  parsed.secure !== undefined
                    ? parsed.secure
                    : process.env.NODE_ENV === 'production',
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

  // Сценарій 2: Обробка ПУБЛІЧНИХ маршрутів (авторизація/реєстрація)
  if (isPublicRoute && accessToken) {
    console.log('PROXY: Authenticated user detected on public route, redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
