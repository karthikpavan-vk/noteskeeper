
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/context/NotesContext";
import { notesColorOptions } from "@/lib/notesData";
import { Label } from "@/components/ui/label";
import { Check, Pencil, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NoteEditor() {
  const { activeNote, updateNote, folders } = useNotes();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folder, setFolder] = useState("");
  const [color, setColor] = useState("note-purple");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setFolder(activeNote.folder);
      setColor(activeNote.color);
      setTags(activeNote.tags);
      setIsEditing(false);
    }
  }, [activeNote]);

  const handleSave = () => {
    if (!activeNote) return;
    
    updateNote(activeNote.id, {
      title,
      content,
      folder,
      color,
      tags,
    });
    
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!activeNote) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a note or create a new one</p>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-background border-none shadow-none">
      <div className="p-4 flex justify-between items-center border-b">
        {isEditing ? (
          <div className="flex w-full space-x-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="text-lg font-medium"
            />
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        ) : (
          <div className="flex w-full justify-between">
            <h2 className="text-lg font-medium">{title}</h2>
            <Button variant="ghost" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow overflow-auto">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="min-h-[300px] resize-none"
          />
        ) : (
          <div className="editor-content whitespace-pre-wrap">{content}</div>
        )}
      </div>

      {isEditing && (
        <div className="p-4 border-t space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="folder">Folder</Label>
              <Select value={folder} onValueChange={setFolder}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders
                    .filter((f) => f.id !== "all" && f.id !== "archived")
                    .map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {notesColorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-2 bg-${option.value}`}
                          style={{
                            backgroundColor: `var(--${option.value.replace("note-", "")})`
                          }}
                        ></div>
                        {option.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div key={tag} className="tag flex items-center">
                  #{tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <span className="text-xs">×</span>
                  </Button>
                </div>
              ))}
              <div className="flex">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="w-32 h-7 text-xs"
                  onKeyPress={handleKeyPress}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleAddTag}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
