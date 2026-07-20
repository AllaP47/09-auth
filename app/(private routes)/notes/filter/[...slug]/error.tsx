'use client';

import React from 'react';

export default function NotesError({ error }: { error: Error }) {
  return <p style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Could not fetch the list of notes. {error.message}</p>;
}

