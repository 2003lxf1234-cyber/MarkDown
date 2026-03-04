import React, { useState } from 'react';
import { Note } from '../types';

interface TagManagerProps {
  note: Note;
  onUpdateTags: (noteId: string, tags: string[]) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({ note, onUpdateTags }) => {
  const [newTag, setNewTag] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !note.tags.includes(newTag.trim())) {
      onUpdateTags(note.id, [...note.tags, newTag.trim()]);
      setNewTag('');
      setIsAdding(false);
    }
  };

  const handleRemoveTag = (tag: string) => {
    onUpdateTags(note.id, note.tags.filter(t => t !== tag));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <span className="text-sm text-gray-500 dark:text-gray-400">标签:</span>
      {note.tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full"
        >
          {tag}
          <button
            onClick={() => handleRemoveTag(tag)}
            className="hover:text-red-500"
          >
            ×
          </button>
        </span>
      ))}
      {isAdding ? (
        <input
          type="text"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleAddTag();
            if (e.key === 'Escape') {
              setIsAdding(false);
              setNewTag('');
            }
          }}
          onBlur={() => {
            if (newTag.trim()) {
              handleAddTag();
            } else {
              setIsAdding(false);
            }
          }}
          placeholder="输入标签"
          className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-white w-20"
          autoFocus
        />
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-dashed border-gray-300 dark:border-gray-600 rounded-full"
        >
          + 添加标签
        </button>
      )}
    </div>
  );
};
