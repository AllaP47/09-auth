import type { Metadata } from 'next';
import { fetchNoteById } from '../../../../lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await fetchNoteById(id);
    const pageUrl = `https://notehub.com/notes/${id}`;

    return {
      title: `${note.title} | NoteHub`,
      description: note.content || '',
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content || '',
        url: pageUrl,
        images: [
          {
           
            url: 'https://goit.global',
            width: 1200,
            height: 630,
            alt: `Note: ${note.title}`,
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Note not found | NoteHub',
      description: 'Запитувана нотатка не знайдена.',
      openGraph: {
        title: 'Note not found | NoteHub',
        description: 'Запитувана нотатка не знайдена.',
        url: `https://notehub.com/notes/${id}`,
        images: [
          {
          
            url: 'https://goit.global',
            width: 1200,
            height: 630,
            alt: 'Note not found',
          },
        ],
      },
    };
  }
}

export default async function NotePage({ params }: Props) {
  await params;
  return <NoteDetailsClient />;
}
