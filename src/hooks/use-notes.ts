'use client';

import { useState, useCallback, useEffect } from 'react';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/types/note';
import { createNote, updateNote, searchNotes, sortNotesByUpdated } from '@/lib/note-utils';
import { useLocalStorage } from './use-local-storage';

export function useNotes() {
  const [notes, setNotes, notesLoaded] = useLocalStorage<Note[]>('notes', []);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-select first note when notes are loaded
  useEffect(() => {
    if (notesLoaded && notes.length > 0 && !selectedNoteId) {
      const sortedNotes = sortNotesByUpdated(notes);
      setSelectedNoteId(sortedNotes[0].id);
    }
  }, [notes, notesLoaded, selectedNoteId]);

  // Get filtered and sorted notes
  const filteredNotes = searchNotes(notes, searchQuery);
  const sortedNotes = sortNotesByUpdated(filteredNotes);

  // Get currently selected note
  const selectedNote = selectedNoteId 
    ? notes.find((note: Note) => note.id === selectedNoteId) 
    : null;

  // Create a new note
  const addNote = useCallback((input?: CreateNoteInput) => {
    const newNote = createNote(input);
    setNotes((prevNotes: Note[]) => [newNote, ...prevNotes]);
    setSelectedNoteId(newNote.id);
    return newNote;
  }, [setNotes]);

  // Update an existing note
  const updateNoteById = useCallback((input: UpdateNoteInput) => {
    setNotes((prevNotes: Note[]) => 
      prevNotes.map((note: Note) => 
        note.id === input.id 
          ? updateNote(note, { title: input.title, content: input.content })
          : note
      )
    );
  }, [setNotes]);

  // Delete a note
  const deleteNote = useCallback((id: string) => {
    setNotes((prevNotes: Note[]) => {
      const newNotes = prevNotes.filter((note: Note) => note.id !== id);
      
      // If we deleted the selected note, select the first remaining note
      if (selectedNoteId === id) {
        const sortedRemaining = sortNotesByUpdated(newNotes);
        setSelectedNoteId(sortedRemaining.length > 0 ? sortedRemaining[0].id : null);
      }
      
      return newNotes;
    });
  }, [setNotes, selectedNoteId]);

  // Select a note
  const selectNote = useCallback((id: string | null) => {
    setSelectedNoteId(id);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Get note by ID
  const getNoteById = useCallback((id: string) => {
    return notes.find((note: Note) => note.id === id);
  }, [notes]);

  return {
    // Data
    notes: sortedNotes,
    selectedNote,
    selectedNoteId,
    searchQuery,
    isLoaded: notesLoaded,
    
    // Actions
    addNote,
    updateNoteById,
    deleteNote,
    selectNote,
    setSearchQuery,
    clearSearch,
    getNoteById,
    
    // Computed
    hasNotes: notes.length > 0,
    filteredNotesCount: filteredNotes.length,
    totalNotesCount: notes.length,
  };
}