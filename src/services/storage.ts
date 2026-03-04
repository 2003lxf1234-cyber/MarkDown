import { Note, Folder } from '../types';
import { v4 as uuidv4 } from 'uuid';

const NOTES_KEY = 'markdown_notes_app_notes';
const FOLDERS_KEY = 'markdown_notes_app_folders';
const THEME_KEY = 'markdown_notes_app_theme';

export const storage = {
  getNotes: (): Note[] => {
    const data = localStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveNotes: (notes: Note[]): void => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  },

  getFolders: (): Folder[] => {
    const data = localStorage.getItem(FOLDERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    const defaultFolder: Folder = {
      id: 'default',
      name: '默认文件夹',
      parentId: null,
      createdAt: Date.now(),
    };
    localStorage.setItem(FOLDERS_KEY, JSON.stringify([defaultFolder]));
    return [defaultFolder];
  },

  saveFolders: (folders: Folder[]): void => {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  },

  getTheme: (): 'light' | 'dark' => {
    const theme = localStorage.getItem(THEME_KEY);
    return (theme as 'light' | 'dark') || 'light';
  },

  saveTheme: (theme: 'light' | 'dark'): void => {
    localStorage.setItem(THEME_KEY, theme);
  },

  createNote: (folderId: string): Note => {
    const notes = storage.getNotes();
    const newNote: Note = {
      id: uuidv4(),
      title: '无标题笔记',
      content: '',
      folderId,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    notes.push(newNote);
    storage.saveNotes(notes);
    return newNote;
  },

  updateNote: (id: string, updates: Partial<Note>): Note | null => {
    const notes = storage.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;
    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: Date.now(),
    };
    storage.saveNotes(notes);
    return notes[index];
  },

  deleteNote: (id: string): void => {
    const notes = storage.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    storage.saveNotes(filtered);
  },

  createFolder: (name: string, parentId: string | null = null): Folder => {
    const folders = storage.getFolders();
    const newFolder: Folder = {
      id: uuidv4(),
      name,
      parentId,
      createdAt: Date.now(),
    };
    folders.push(newFolder);
    storage.saveFolders(folders);
    return newFolder;
  },

  updateFolder: (id: string, name: string): Folder | null => {
    const folders = storage.getFolders();
    const index = folders.findIndex(f => f.id === id);
    if (index === -1) return null;
    folders[index] = { ...folders[index], name };
    storage.saveFolders(folders);
    return folders[index];
  },

  deleteFolder: (id: string): void => {
    if (id === 'default') return;
    const folders = storage.getFolders();
    const notes = storage.getNotes();
    const filteredFolders = folders.filter(f => f.id !== id && f.parentId !== id);
    const filteredNotes = notes.filter(n => n.folderId !== id);
    storage.saveFolders(filteredFolders);
    storage.saveNotes(filteredNotes);
  },

  searchNotes: (query: string): Note[] => {
    const notes = storage.getNotes();
    const lowerQuery = query.toLowerCase();
    return notes.filter(
      n =>
        n.title.toLowerCase().includes(lowerQuery) ||
        n.content.toLowerCase().includes(lowerQuery) ||
        n.tags.some(t => t.toLowerCase().includes(lowerQuery))
    );
  },
};
