'use client';

import React from 'react';

export default function NoteDetailsError({ error }: { error: Error }) {
  return <p style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Could not fetch note details. {error.message}</p>;
}
