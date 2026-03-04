import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Note } from '../types';

interface PreviewProps {
  note: Note | null;
  isDark: boolean;
}

export const Preview: React.FC<PreviewProps> = ({ note, isDark }) => {
  if (!note) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <p>预览区域</p>
          <p className="text-sm mt-2">选择笔记查看渲染效果</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>预览: {note.title}</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="markdown-preview prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                const isInline = !language;
                
                if (isInline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
                
                return (
                  <SyntaxHighlighter
                    style={isDark ? oneDark : oneLight}
                    language={language}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              },
            }}
          >
            {note.content || '*开始输入内容...*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
