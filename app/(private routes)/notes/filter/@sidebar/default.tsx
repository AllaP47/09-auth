// app/notes/filter/@sidebar/default.tsx
import React from 'react';
import Link from 'next/link';

const tags: string[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function SidebarNotes() {
  return (
    <ul>
      <li>
        <Link href="/notes/filter/all">
          All notes
        </Link>
      </li>
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={`/notes/filter/${tag}`}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
