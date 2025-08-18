import { Note, CreateNoteInput } from '@/types/note';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function createNote(input: CreateNoteInput = {}): Note {
  const now = new Date();
  return {
    id: generateId(),
    title: input.title || 'Untitled Note',
    content: input.content || '',
    createdAt: now,
    updatedAt: now,
  };
}

export function updateNote(note: Note, updates: Partial<Pick<Note, 'title' | 'content'>>): Note {
  return {
    ...note,
    ...updates,
    updatedAt: new Date(),
  };
}

export function searchNotes(notes: Note[], query: string): Note[] {
  if (!query.trim()) return notes;
  
  const lowercaseQuery = query.toLowerCase();
  return notes.filter(note => 
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.content.toLowerCase().includes(lowercaseQuery)
  );
}

export function sortNotesByUpdated(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60);
    return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function getWordCount(content: string): number {
  return content.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}