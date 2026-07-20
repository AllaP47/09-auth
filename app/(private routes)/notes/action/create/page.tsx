import type { Metadata } from 'next';
import { NoteForm } from '../../../../components/NoteForm/NoteForm'; 
import css from './createnote.module.css';



export const metadata: Metadata = {
  title: 'Створення нотатки | NoteHub',
  description: 'Створюйте нові нотатки у своєму профілі.',
  openGraph: {
    // ВИПРАВЛЕНО: Для цієї сторінки вказуємо її точний канонічний URL
    url: 'https://notehub.com/notes/action/create', 
    type: 'website',
    title: 'Створення нотатки | NoteHub',
    description: 'Створюйте нові нотатки у своєму профілі.',
    images: [
      {
    
        url: 'https://notehub.com', 
        width: 1200,
        height: 630,
        alt: 'NoteHub - Створення нотатки',
      },
    ],
  },
};




export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
