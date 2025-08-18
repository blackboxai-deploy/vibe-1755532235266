export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
}

export interface CreateNoteInput {
  title?: string;
  content?: string;
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
}