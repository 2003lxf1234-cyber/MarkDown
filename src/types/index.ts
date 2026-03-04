export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
}

export interface AppState {
  notes: Note[];
  folders: Folder[];
  currentNoteId: string | null;
  currentFolderId: string | null;
  searchQuery: string;
  theme: 'light' | 'dark';
}
