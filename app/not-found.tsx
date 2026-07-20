import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page not found | NoteHub',
  description: 'Запитувана сторінка не знайдена. Перевірте правильність введеної адреси.',
  openGraph: {
    title: '404 - Page not found | NoteHub',
    description: 'Запитувана сторінка не знайдена. Перевірте правильність введеної адреси.',
    url: 'https://notehub.com', 
    type: 'website',
    images: [
      {
       
        url: 'https://goit.global',
        width: 1200,
        height: 630,
        alt: '404 - Page not found | NoteHub',
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>404 - Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/notes/filter/all" style={{ color: '#0d6efd', textDecoration: 'underline' }}>
        Back to notes
      </Link>
    </div>
  );
}

