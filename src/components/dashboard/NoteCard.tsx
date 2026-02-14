import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Star, Pin, Trash2 } from 'lucide-react';
import { Note } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cleanNoteContent, cleanNoteTitle, cleanTags } from '@/lib/cleanNoteContent';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

const colorMap: Record<string, string> = {
  '#ffffff': 'bg-background',
  '#F8F9FA': 'bg-card',
  '#1a1a1a': 'bg-card',
  '#faf5f0': 'bg-note-cream',
  '#e8f0e8': 'bg-note-sage',
  '#f0e8f5': 'bg-note-lavender',
  '#fae8e0': 'bg-note-peach',
  '#e0f0fa': 'bg-note-sky',
  '#e0faf0': 'bg-note-mint',
};

export function NoteCard({ 
  note, 
  onEdit, 
  onDelete, 
  onToggleFavorite,
}: NoteCardProps) {
  const bgClass = colorMap[note.bg_color] || 'bg-card';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={() => onEdit(note)}
      className={cn(
        "group relative p-5 rounded-xl border border-border/40 hover:border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer min-h-[200px] flex flex-col",
        !note.bg_image_url && bgClass
      )}
      style={note.bg_image_url ? { backgroundColor: note.bg_color || '#F8F9FA' } : undefined}
    >
      {/* Background image layer */}
      {note.bg_image_url && (
        <>
          <div
            className="absolute inset-0 z-0 rounded-xl"
            style={{
              backgroundImage: `url(${note.bg_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {/* Light overlay for text readability */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/40 via-white/45 to-white/55" />
        </>
      )}

      {/* Pin indicator */}
      {note.is_pinned && (
        <div className="absolute top-3 right-3 z-10">
          <Pin className="w-4 h-4 text-primary fill-primary drop-shadow-sm" />
        </div>
      )}

      {/* Favorite indicator */}
      {note.is_favorite && (
        <div className="absolute top-3 right-11 z-10">
          <Star className="w-4 h-4 text-primary fill-primary drop-shadow-sm" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-3 text-base">
          {cleanNoteTitle(note.title)}
        </h3>

        {note.content && (
          <p className="text-sm text-muted-foreground line-clamp-5 mb-4 flex-1">
            {cleanNoteContent(note.content)}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2">
          <span>{format(new Date(note.updated_at), 'M/d/yyyy')}</span>
          {note.tags && note.tags.length > 0 && (
            <span className="truncate ml-2">{cleanTags(note.tags).join(', ')}</span>
          )}
        </div>
      </div>

      {/* Action buttons - always visible on mobile, visible on hover on desktop */}
      <div className="absolute bottom-3 right-3 z-20 flex opacity-100 sm:opacity-0 sm:group-hover:opacity-100 items-center gap-1 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/95 backdrop-blur-sm hover:bg-background shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(note.id, note.is_favorite);
          }}
        >
          <Star
            className={cn(
              "w-4 h-4",
              note.is_favorite ? "fill-primary text-primary" : "text-muted-foreground"
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/95 backdrop-blur-sm hover:bg-background hover:text-destructive shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
