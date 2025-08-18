'use client';

import { ChangeEvent } from 'react';
import { Note } from '@/types/note';
import { NoteItem } from './note-item';
import { EmptyState } from './empty-state';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NoteSidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  onNoteSelect: (id: string) => void;
  onNoteCreate: () => void;
  onSearchChange: (query: string) => void;
  isLoaded: boolean;
}

export function NoteSidebar({
  notes,
  selectedNoteId,
  searchQuery,
  onNoteSelect,
  onNoteCreate,
  onSearchChange,
  isLoaded
}: NoteSidebarProps) {
  if (!isLoaded) {
    return (
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Notes
          </h1>
          <Button onClick={onNoteCreate} size="sm">
            New Note
          </Button>
        </div>
        
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className="bg-white dark:bg-gray-800"
        />
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-hidden">
        {notes.length === 0 ? (
          <div className="h-full flex items-center justify-center p-4">
            {searchQuery ? (
              <EmptyState
                title="No notes found"
                description={`No notes match "${searchQuery}"`}
                action={
                  <Button variant="outline" onClick={() => onSearchChange('')}>
                    Clear search
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="No notes yet"
                description="Create your first note to get started"
                action={
                  <Button onClick={onNoteCreate}>
                    Create Note
                  </Button>
                }
              />
            )}
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-0">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isSelected={selectedNoteId === note.id}
                  onClick={() => onNoteSelect(note.id)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </div>
      </div>
    </div>
  );
}