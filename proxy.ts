import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';
import { parseSetCookie } from './lib/utils/cookies';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Зчитуємо куки через асинхронну функцію cookies() з next/headers
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Сценарій 1: Обробка захищених ПРИВАТНИХ маршрутів
  if (isPrivateRoute) {
    // Якщо немає жодного токену взагалі — редірект на сторінку входу
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Якщо accessToken відсутній, але є refreshToken — оновлюємо сесію
    if (!accessToken && refreshToken) {
      try {
        console.log('PROXY: Access token expired, attempting session refresh via checkSession');
        const sessionResponse = await checkSession();

        // Перевіряємо статус відповіді та наявність даних користувача
        if (
          !sessionResponse ||
          sessionResponse.status !== 200 ||
          !sessionResponse.data ||
          !sessionResponse.data.email
        ) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
        }

        console.log('PROXY: Session refreshed successfully on backend');

        // Ініціалізуємо об'єкт відповіді для продовження переходу
        const response = NextResponse.next();

        // ВИПРАВЛЕНО: Розпаршуємо заголовок set-cookie та примусово виставляємо нові токени
        const setCookieHeader = sessionResponse.headers['set-cookie'];
        if (setCookieHeader) {
          console.log('PROXY: Injecting updated cookies into outbound response stream');

          const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

          cookiesArray.forEach(cookieStr => {
            const cookieData = parseSetCookie(cookieStr.toString());
            response.cookies.set(cookieData.name, cookieData.value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              path: '/',
            });
          });
        }

        // ВИПРАВЛЕНО: Повертаємо модифіковану відповідь, щоб користувач продовжив свій початковий перехід
        return response;
      } catch (error) {
        console.error('PROXY ERROR: Session refresh failed', error);
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  // Сценарій 2: Обробка доступу авторизованого користувача до ПУБЛІЧНИХ сторінок
  if (isPublicRoute && (accessToken || refreshToken)) {
    // Авторизованих користувачів редіректимо на головну сторінку (/) за ТЗ
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
