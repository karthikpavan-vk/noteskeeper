
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Note, Folder, initialFolders } from "@/lib/notesData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface NotesContextProps {
  notes: Note[];
  folders: Folder[];
  activeFolder: string;
  activeNote: Note | null;
  searchTerm: string;
  setActiveFolder: (folderId: string) => void;
  setActiveNote: (note: Note | null) => void;
  setSearchTerm: (term: string) => void;
  createNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "user_id">) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  filteredNotes: Note[];
  isLoading: boolean;
}

const NotesContext = createContext<NotesContextProps | undefined>(undefined);

export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Fetch notes when user changes
  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      // Clear notes when logged out
      setNotes([]);
      setActiveNote(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match our Note type
        const transformedNotes: Note[] = data.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          folder: note.folder,
          color: note.color,
          tags: note.tags,
          createdAt: note.created_at,
          updatedAt: note.updated_at
        }));
        setNotes(transformedNotes);
      }
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "user_id">) => {
    if (!user) {
      toast.error("You must be logged in to create notes");
      return;
    }

    try {
      const now = new Date().toISOString();
      
      // Insert note into Supabase
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: note.title,
          content: note.content,
          folder: note.folder,
          color: note.color,
          tags: note.tags,
          user_id: user.id,
          created_at: now,
          updated_at: now
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newNote: Note = {
          id: data.id,
          title: data.title,
          content: data.content,
          folder: data.folder,
          color: data.color,
          tags: data.tags,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };

        setNotes(prevNotes => [newNote, ...prevNotes]);
        setActiveNote(newNote);
        toast.success("Note created");
      }
    } catch (error: any) {
      console.error("Error creating note:", error);
      toast.error("Failed to create note");
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      // Remove properties that shouldn't be sent to Supabase
      const { createdAt, updatedAt, id, ...validUpdates } = updates;
      
      // Convert to snake_case for Supabase
      const supabaseUpdates = {
        ...(validUpdates.title && { title: validUpdates.title }),
        ...(validUpdates.content && { content: validUpdates.content }),
        ...(validUpdates.folder && { folder: validUpdates.folder }),
        ...(validUpdates.color && { color: validUpdates.color }),
        ...(validUpdates.tags && { tags: validUpdates.tags }),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('notes')
        .update(supabaseUpdates)
        .eq('id', noteId);

      if (error) {
        throw error;
      }

      // Update local state
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteId
            ? { ...note, ...updates, updatedAt: new Date().toISOString() }
            : note
        )
      );

      if (activeNote?.id === noteId) {
        setActiveNote(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
      }
      
      toast.success("Note updated");
    } catch (error: any) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        throw error;
      }

      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      
      if (activeNote?.id === noteId) {
        setActiveNote(null);
      }
      
      toast.success("Note deleted");
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const filteredNotes = notes
    .filter(note => {
      // Filter by folder
      if (activeFolder !== "all") {
        return note.folder === activeFolder;
      }
      return true;
    })
    .filter(note => {
      // Filter by search term
      if (searchTerm.trim() === "") {
        return true;
      }
      
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        note.title.toLowerCase().includes(lowerSearchTerm) ||
        note.content.toLowerCase().includes(lowerSearchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <NotesContext.Provider
      value={{
        notes,
        folders,
        activeFolder,
        activeNote,
        searchTerm,
        setActiveFolder,
        setActiveNote,
        setSearchTerm,
        createNote,
        updateNote,
        deleteNote,
        filteredNotes,
        isLoading
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
