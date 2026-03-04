import React, { useCallback, useMemo } from 'react';
import { Note } from '../types';

interface EditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

export const Editor: React.FC<EditorProps> = ({ note, onUpdateNote }) => {
  const headings = useMemo(() => {
    if (!note?.content) return [];
    const regex = /^(#{1,6})\s+(.+)$/gm;
    const matches: { level: number; text: string }[] = [];
    let match;
    while ((match = regex.exec(note.content)) !== null) {
      matches.push({
        level: match[1].length,
        text: match[2],
      });
    }
    return matches;
  }, [note?.content]);

  const wordCount = useMemo(() => {
    if (!note?.content) return 0;
    return note.content.replace(/\s+/g, '').length;
  }, [note?.content]);

  const lineCount = useMemo(() => {
    if (!note?.content) return 0;
    return note.content.split('\n').length;
  }, [note?.content]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (note) {
        const content = e.target.value;
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : '无标题笔记';
        onUpdateNote(note.id, { content, title });
      }
    },
    [note, onUpdateNote]
  );

  const insertText = useCallback(
    (before: string, after: string = '') => {
      if (!note) return;
      const textarea = document.querySelector('textarea');
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = note.content.substring(start, end);
      const newContent =
        note.content.substring(0, start) +
        before +
        selectedText +
        after +
        note.content.substring(end);
      const titleMatch = newContent.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : '无标题笔记';
      onUpdateNote(note.id, { content: newContent, title });
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      }, 0);
    },
    [note, onUpdateNote]
  );

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>选择一个笔记开始编辑</p>
          <p className="text-sm mt-2">或点击左侧 + 创建新笔记</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex items-center gap-1 flex-wrap">
        <button
          onClick={() => insertText('**', '**')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="加粗 (Ctrl+B)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>
        <button
          onClick={() => insertText('*', '*')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="斜体 (Ctrl+I)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-4 0h8" transform="skewX(-10)" />
          </svg>
        </button>
        <button
          onClick={() => insertText('~~', '~~')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="删除线"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.5 10H19a2 2 0 012 2v0a2 2 0 01-2 2h-1.5M6.5 14H5a2 2 0 01-2-2v0a2 2 0 012-2h1.5M4 12h16" />
          </svg>
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          onClick={() => insertText('# ')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="一级标题"
        >
          H1
        </button>
        <button
          onClick={() => insertText('## ')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="二级标题"
        >
          H2
        </button>
        <button
          onClick={() => insertText('### ')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="三级标题"
        >
          H3
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          onClick={() => insertText('- ')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="无序列表"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          onClick={() => insertText('1. ')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="有序列表"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01" />
          </svg>
        </button>
        <button
          onClick={() => insertText('> ')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="引用"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          onClick={() => insertText('```\n', '\n```')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="代码块"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
        <button
          onClick={() => insertText('[', '](url)')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="链接"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        <button
          onClick={() => insertText('![alt](', ')')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="图片"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={() => insertText('\n---\n')}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="分割线"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>文件: {note.title}</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span>字数: {wordCount}</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span>行数: {lineCount}</span>
            </div>
          </div>
          <textarea
            value={note.content}
            onChange={handleChange}
            className="flex-1 p-4 resize-none focus:outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed"
            placeholder="开始输入 Markdown 内容..."
            spellCheck={false}
          />
        </div>

        {headings.length > 0 && (
          <div className="w-48 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
            <div className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">目录</div>
            {headings.map((h, i) => (
              <div
                key={i}
                className="px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer truncate"
                style={{ paddingLeft: `${(h.level - 1) * 8 + 8}px` }}
              >
                {h.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
