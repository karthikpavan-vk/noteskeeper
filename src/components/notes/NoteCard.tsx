
import { Note } from "@/lib/notesData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, isActive, onSelect, onDelete }: NoteCardProps) {
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Card 
      className={cn(
        "mb-3 cursor-pointer note-card-transition border-l-4",
        isActive ? "border-primary bg-secondary/50" : "border-transparent hover:border-primary/50",
        `border-${note.color}`
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium line-clamp-1">{note.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {truncateContent(note.content)}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {format(new Date(note.updatedAt), "MMM d, yyyy")}
        </div>
      </CardContent>
    </Card>
  );
}
