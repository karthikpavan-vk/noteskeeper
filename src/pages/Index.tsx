
import { NotesProvider } from "@/context/NotesContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/notes/SearchBar";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { useNotes } from "@/context/NotesContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function NotesLayout() {
  const { filteredNotes, activeNote, setActiveNote, deleteNote, activeFolder, folders, isLoading } = useNotes();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [showNoteList, setShowNoteList] = useState(true);
  
  const activeFolderName = folders.find(f => f.id === activeFolder)?.name || "All Notes";
  
  const handleNoteSelect = (noteId: string) => {
    const note = filteredNotes.find((n) => n.id === noteId);
    if (note) {
      setActiveNote(note);
      if (isMobile) {
        setShowNoteList(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">
        {/* Note List */}
        <div 
          className={cn(
            "flex flex-col border-r",
            isMobile 
              ? `absolute inset-y-0 left-16 z-10 bg-background transition-transform w-full 
                 ${showNoteList ? "translate-x-0" : "translate-x-[-100%]"}`
              : "w-1/3"
          )}
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium mb-2">{activeFolderName}</h2>
            <SearchBar />
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isActive={activeNote?.id === note.id}
                    onSelect={() => handleNoteSelect(note.id)}
                    onDelete={() => deleteNote(note.id)}
                  />
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">
                    {user ? "No notes found" : "Please sign in to see your notes"}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          {isMobile && (
            <div className="p-2 border-t flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNoteList(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Note Editor */}
        <div className={cn("flex-1", isMobile && !showNoteList ? "z-20" : "")}>
          {isMobile && !showNoteList && (
            <div className="p-2 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNoteList(true)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          <NoteEditor />
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <NotesProvider>
      <NotesLayout />
    </NotesProvider>
  );
};

export default Index;
