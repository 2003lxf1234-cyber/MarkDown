import React, { useState } from 'react';
import { Note, Folder } from '../types';

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  currentFolderId: string | null;
  currentNoteId: string | null;
  searchQuery: string;
  onSelectFolder: (id: string) => void;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onCreateFolder: (name: string) => void;
  onDeleteNote: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  onSearch: (query: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  notes,
  currentFolderId,
  currentNoteId,
  searchQuery,
  onSelectFolder,
  onSelectNote,
  onCreateNote,
  onCreateFolder,
  onDeleteNote,
  onDeleteFolder,
  onSearch,
}) => {
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const filteredNotes = searchQuery
    ? notes.filter(
        n =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : notes.filter(n => n.folderId === currentFolderId);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  return (
    <div className="w-64 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-4">📝 Markdown 笔记</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">文件夹</span>
            <button
              onClick={() => setShowNewFolderInput(true)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              title="新建文件夹"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {showNewFolderInput && (
            <div className="px-2 py-1">
              <input
                type="text"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCreateFolder();
                  if (e.key === 'Escape') {
                    setShowNewFolderInput(false);
                    setNewFolderName('');
                  }
                }}
                onBlur={() => {
                  if (newFolderName.trim()) {
                    handleCreateFolder();
                  } else {
                    setShowNewFolderInput(false);
                  }
                }}
                placeholder="文件夹名称"
                className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
                autoFocus
              />
            </div>
          )}

          {folders.map(folder => (
            <div
              key={folder.id}
              onClick={() => onSelectFolder(folder.id)}
              className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer group ${
                currentFolderId === folder.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <span className="text-sm truncate">{folder.name}</span>
              </div>
              {folder.id !== 'default' && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onDeleteFolder(folder.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              {searchQuery ? '搜索结果' : '笔记'}
            </span>
            {!searchQuery && (
              <button
                onClick={onCreateNote}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                title="新建笔记"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>

          {filteredNotes.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? '没有找到匹配的笔记' : '暂无笔记，点击 + 创建'}
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer group ${
                  currentNoteId === note.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{note.title || '无标题'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 ml-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
