import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { TagManager } from './components/TagManager';
import { Note, Folder } from './types';
import { storage } from './services/storage';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const currentNote = notes.find(n => n.id === currentNoteId) || null;

  useEffect(() => {
    setNotes(storage.getNotes());
    const loadedFolders = storage.getFolders();
    setFolders(loadedFolders);
    setCurrentFolderId(loadedFolders[0]?.id || null);
    setTheme(storage.getTheme());
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.saveTheme(theme);
  }, [theme]);

  const handleSelectFolder = useCallback((id: string) => {
    setCurrentFolderId(id);
    setSearchQuery('');
  }, []);

  const handleSelectNote = useCallback((id: string) => {
    setCurrentNoteId(id);
  }, []);

  const handleCreateNote = useCallback(() => {
    if (!currentFolderId) return;
    const newNote = storage.createNote(currentFolderId);
    setNotes(prev => [...prev, newNote]);
    setCurrentNoteId(newNote.id);
  }, [currentFolderId]);

  const handleCreateFolder = useCallback((name: string) => {
    const newFolder = storage.createFolder(name);
    setFolders(prev => [...prev, newFolder]);
  }, []);

  const handleUpdateNote = useCallback((id: string, updates: Partial<Note>) => {
    const updated = storage.updateNote(id, updates);
    if (updated) {
      setNotes(prev => prev.map(n => (n.id === id ? updated : n)));
    }
  }, []);

  const handleDeleteNote = useCallback((id: string) => {
    storage.deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (currentNoteId === id) {
      setCurrentNoteId(null);
    }
  }, [currentNoteId]);

  const handleDeleteFolder = useCallback((id: string) => {
    storage.deleteFolder(id);
    setFolders(storage.getFolders());
    setNotes(storage.getNotes());
    if (currentFolderId === id) {
      const remaining = storage.getFolders();
      setCurrentFolderId(remaining[0]?.id || null);
    }
  }, [currentFolderId]);

  const handleUpdateTags = useCallback((noteId: string, tags: string[]) => {
    handleUpdateNote(noteId, { tags });
  }, [handleUpdateNote]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar
        folders={folders}
        notes={notes}
        currentFolderId={currentFolderId}
        currentNoteId={currentNoteId}
        searchQuery={searchQuery}
        onSelectFolder={handleSelectFolder}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onCreateFolder={handleCreateFolder}
        onDeleteNote={handleDeleteNote}
        onDeleteFolder={handleDeleteFolder}
        onSearch={setSearchQuery}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentNote ? `编辑中: ${currentNote.title}` : 'Markdown 笔记应用'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {currentNote && (
          <TagManager note={currentNote} onUpdateTags={handleUpdateTags} />
        )}

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
            <Editor note={currentNote} onUpdateNote={handleUpdateNote} />
          </div>
          <div className="flex-1">
            <Preview note={currentNote} isDark={theme === 'dark'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
