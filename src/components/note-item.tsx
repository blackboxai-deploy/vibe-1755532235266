'use client';

import { Note } from '@/types/note';
import { formatDate, truncateText, getWordCount } from '@/lib/note-utils';
import { cn } from '@/lib/utils';

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
}

export function NoteItem({ note, isSelected, onClick }: NoteItemProps) {
  const preview = truncateText(note.content.replace(/\n/g, ' '), 80);
  const wordCount = getWordCount(note.content);

  return (
    <div
      className={cn(
        'p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
        isSelected && 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500'
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate pr-2">
            {note.title}
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
            {formatDate(note.updatedAt)}
          </span>
        </div>
        
        {preview && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 overflow-hidden">
            {preview}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{wordCount} words</span>
          <span>{formatDate(note.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}