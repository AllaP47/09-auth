export type NoteTagType = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Ideas';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTagType;
  createdAt?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
}
