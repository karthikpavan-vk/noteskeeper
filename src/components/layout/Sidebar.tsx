
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNotes } from "@/context/NotesContext";
import { cn } from "@/lib/utils";
import { BookOpen, File, Plus, Menu, BookText, Archive, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  "book-open": BookOpen,
  "book": BookText,
  "file-text": File,
  "archive": Archive
};

export function Sidebar() {
  const { folders, activeFolder, setActiveFolder, createNote } = useNotes();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleCreateNote = () => {
    const targetFolder = activeFolder === "all" ? "personal" : activeFolder;
    createNote({
      title: "New Note",
      content: "",
      tags: [],
      color: "note-purple",
      folder: targetFolder,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <div
      className={cn(
        "h-screen flex flex-col bg-secondary border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-xl font-bold">NotesApp</h1>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      
      {user ? (
        <Button 
          onClick={handleCreateNote} 
          className={cn(
            "mx-4 mb-4", 
            collapsed ? "p-2" : ""
          )}
        >
          <Plus className="h-4 w-4 mr-2" />
          {!collapsed && <span>New Note</span>}
        </Button>
      ) : (
        <Button 
          onClick={handleSignIn} 
          className={cn(
            "mx-4 mb-4", 
            collapsed ? "p-2" : ""
          )}
        >
          <User className="h-4 w-4 mr-2" />
          {!collapsed && <span>Sign In</span>}
        </Button>
      )}
      
      <Separator />
      <div className="flex flex-col flex-grow overflow-auto p-2">
        {folders.map((folder) => {
          const Icon = iconMap[folder.icon] || File;
          return (
            <Button
              key={folder.id}
              variant={activeFolder === folder.id ? "secondary" : "ghost"}
              className={cn(
                "justify-start mb-1", 
                collapsed ? "px-2" : ""
              )}
              onClick={() => setActiveFolder(folder.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {!collapsed && <span>{folder.name}</span>}
            </Button>
          );
        })}
      </div>
      {user && (
        <>
          <Separator />
          <div className="p-4">
            <Button 
              variant="ghost" 
              className={cn("w-full justify-start", collapsed ? "px-2" : "")}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {!collapsed && <span>Sign Out</span>}
            </Button>
            
            {!collapsed && (
              <div className="text-xs text-muted-foreground mt-4">
                <p>Signed in as:</p>
                <p className="truncate">{user.email}</p>
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="p-4">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            NotesApp v1.0
          </div>
        )}
      </div>
    </div>
  );
}
