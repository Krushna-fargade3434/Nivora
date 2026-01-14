import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Star, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { NoteCard } from '@/components/dashboard/NoteCard';
import { NoteEditor } from '@/components/dashboard/NoteEditor';
import { Input } from '@/components/ui/input';
import { useNotes, Note, CreateNoteInput } from '@/hooks/useNotes';

export default function Favorites() {
  const { notes, isLoading, updateNote, deleteNote, toggleFavorite, togglePin } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const favoriteNotes = useMemo(() => {
    const favorites = notes.filter((note) => note.is_favorite);
    if (!searchQuery.trim()) return favorites;
    
    const query = searchQuery.toLowerCase();
    return favorites.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  const handleSaveNote = async (data: CreateNoteInput) => {
    if (editingNote) {
      await updateNote.mutateAsync({ id: editingNote.id, ...data });
      setEditingNote(null);
    }
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote.mutateAsync(id);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Favorites
          </h1>
          <p className="text-muted-foreground">
            Your starred notes for quick access
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Notes grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : favoriteNotes.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              {searchQuery ? 'No favorites found' : 'No favorites yet'}
            </h2>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Star your important notes to see them here'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="popLayout">
              {favoriteNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={setEditingNote}
                  onDelete={handleDeleteNote}
                  onToggleFavorite={(id, isFavorite) =>
                    toggleFavorite.mutate({ id, is_favorite: isFavorite })
                  }
                  onTogglePin={(id, isPinned) =>
                    togglePin.mutate({ id, is_pinned: isPinned })
                  }
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Note editor modal */}
        <AnimatePresence>
          {editingNote && (
            <NoteEditor
              note={editingNote}
              onSave={handleSaveNote}
              onClose={() => setEditingNote(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
