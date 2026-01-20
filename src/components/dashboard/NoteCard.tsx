import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Star, Pin, Trash2, Edit } from 'lucide-react';
import { Note } from '@/hooks/useNotes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
}

const colorMap: Record<string, string> = {
  '#ffffff': 'bg-card',
  '#ddd4c7': 'bg-note-cream',
  '#c8dcd2': 'bg-note-sage',
  '#dcd4e3': 'bg-note-lavender',
  '#ddc8ba': 'bg-note-peach',
  '#c4dde8': 'bg-note-sky',
  '#c9e0d5': 'bg-note-mint',
};

export const NoteCard = forwardRef<HTMLDivElement, NoteCardProps>(({ 
  note, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onTogglePin 
}, ref) => {
  const bgClass = colorMap[note.bg_color] || 'bg-card';

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden",
        !note.bg_image_url && bgClass
      )}
    >
      {/* Background image layer */}
      {note.bg_image_url && (
        <>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${note.bg_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'translateZ(0)'
            }}
          />
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.25) 100%)'
            }}
          />
        </>
      )}

      <div className="relative z-10">
        {/* Pin indicator */}
        {note.is_pinned && (
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <Pin className="w-3 h-3 text-primary-foreground" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
          <h3 className="font-display text-base sm:text-lg font-semibold text-foreground line-clamp-2">
            {note.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(note.id, note.is_favorite);
            }}
          >
            <Star
              className={cn(
                "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors",
                note.is_favorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </Button>
        </div>

        {/* Content preview */}
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-3 sm:mb-4 min-h-[3rem] sm:min-h-[3.75rem] whitespace-pre-wrap font-mono">
          {note.content || 'No content'}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <span className="text-xs text-muted-foreground">
            {format(new Date(note.note_date), 'MMM d, yyyy')}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id, note.is_pinned);
              }}
            >
              <Pin
                className={cn(
                  "w-3.5 h-3.5",
                  note.is_pinned ? "text-primary" : "text-muted-foreground"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
            >
              <Edit className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

NoteCard.displayName = 'NoteCard';
