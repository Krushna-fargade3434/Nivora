import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search, FileText, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { NoteCard } from '@/components/dashboard/NoteCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotes } from '@/hooks/useNotes';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { notes, isLoading, deleteNote, toggleFavorite, togglePin } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content?.toLowerCase().includes(query) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(query)
      )
    );
  }, [notes, searchQuery]);

  const handleDeleteNote = async (id: string) => {
    await deleteNote.mutateAsync(id);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-1 sm:mb-2">
            Your Notes
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage and organize your secure notes
          </p>
        </motion.div>

        {/* Actions bar */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-11 h-11 sm:h-12 rounded-xl text-sm sm:text-base"
            />
          </div>
          <Button
            onClick={() => navigate('/dashboard/new')}
            className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl text-sm sm:text-base w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            New Note
          </Button>
        </motion.div>

        {/* Notes grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first note to get started with Nivora'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/dashboard/new')} className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Create your first note
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(n) => navigate(`/dashboard/note/${n.id}`)}
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
      </div>
    </DashboardLayout>
  );
}
