import type { Metadata } from 'next';
import NotesClient from './Notes.client'; 

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const filterTitle = slug.join(' - '); 
 
  const pageUrl = `https://notehub.com{slug.join('/')}`;

  return {
    title: `Фільтр: ${filterTitle} | NoteHub`,
    description: `Перегляд нотаток, відфільтрованих за параметрами: ${slug.join(', ')}.`,
    openGraph: {
      title: `Фільтр: ${filterTitle} | NoteHub`,
      description: `Перегляд нотаток, відфільтрованих за параметрами: ${slug.join(', ')}.`,
      url: pageUrl,
      images: [
        {
       
          url: 'https://goit.global',
          width: 1200,
          height: 630,
          alt: `Нотатки із фільтром ${filterTitle}`,
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: Props) {
  const { slug } = await params;
  const currentTag = slug[slug.length - 1];

  return <NotesClient tag={currentTag} />;
}
