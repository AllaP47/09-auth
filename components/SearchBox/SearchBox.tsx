import React from 'react';

// Безпечний імпорт стилів для Next.js
import cssStyles from './SearchBox.module.css';
const css = (cssStyles || {}) as Record<string, string>;

interface SearchBoxProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onChange }) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={onChange}
    />
  );
};
