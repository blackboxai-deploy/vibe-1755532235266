'use client';

import { useEffect } from 'react';
import { NoteSidebar } from '@/components/note-sidebar';
import { NoteEditor } from '@/components/note-editor';
import { ThemeToggle } from '@/components/theme-toggle';
import { useNotes } from '@/hooks/use-notes';

export default function Home() {
  const {
    notes,
    selectedNote,
    selectedNoteId,
    searchQuery,
    isLoaded,
    addNote,
    updateNoteById,
    deleteNote,
    selectNote,
    setSearchQuery,
  } = useNotes();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'n') {
          e.preventDefault();
          addNote();
        } else if (e.key === 'k') {
          e.preventDefault();
          // Focus search input
          const searchInput = document.querySelector('input[placeholder="Search notes..."]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addNote]);

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Notes App
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
            Ctrl+N for new note, Ctrl+K to search
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <NoteSidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          searchQuery={searchQuery}
          onNoteSelect={selectNote}
          onNoteCreate={addNote}
          onSearchChange={setSearchQuery}
          isLoaded={isLoaded}
        />
        
        <NoteEditor
          note={selectedNote}
          onUpdate={updateNoteById}
          onDelete={deleteNote}
        />
      </div>
    </div>
  );
}