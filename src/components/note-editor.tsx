'use client';

import { useState, useEffect, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import { Note } from '@/types/note';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getWordCount, formatDate } from '@/lib/note-utils';

interface NoteEditorProps {
  note: Note | null | undefined;
  onUpdate: (input: { id: string; title?: string; content?: string }) => void;
  onDelete: (id: string) => void;
}

export function NoteEditor({ note, onUpdate, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  // Auto-save with debounce
  const debouncedSave = useCallback(() => {
    if (!note) return;
    
    setIsSaving(true);
    const timer = setTimeout(() => {
      onUpdate({ id: note.id, title, content });
      setIsSaving(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [note, title, content, onUpdate]);

  useEffect(() => {
    if (note && (title !== note.title || content !== note.content)) {
      const cleanup = debouncedSave();
      return cleanup;
    }
  }, [title, content, note, debouncedSave]);

  const handleDelete = () => {
    if (note && window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        if (note) {
          onUpdate({ id: note.id, title, content });
        }
      }
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No note selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a note from the sidebar to start editing
          </p>
        </div>
      </div>
    );
  }

  const wordCount = getWordCount(content);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">
            {wordCount} words
          </Badge>
          {isSaving && (
            <Badge variant="outline" className="text-xs">
              Saving...
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Updated {formatDate(note.updatedAt)}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="h-8"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <Input
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="text-xl font-semibold border-none shadow-none px-0 focus-visible:ring-0"
          onKeyDown={handleKeyDown}
        />
        <Textarea
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
          placeholder="Start writing your note..."
          className="flex-1 resize-none border-none shadow-none px-0 focus-visible:ring-0 min-h-[400px]"
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Created {formatDate(note.createdAt)}</span>
          <span>Press Ctrl+S to save manually</span>
        </div>
      </div>
    </div>
  );
}