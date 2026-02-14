import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search, FileText, Loader2, MoreVertical } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { NoteCard } from '@/components/dashboard/NoteCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNotes } from '@/hooks/useNotes';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterType = 'all' | 'quick' | 'passwords' | 'favorites';
type SortType = 'created' | 'edited' | 'title';

export default function Dashboard() {
  const { notes, isLoading, deleteNote, toggleFavorite } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('edited');
  const navigate = useNavigate();

  const filters = [
    { id: 'all' as FilterType, label: 'All notes' },
    { id: 'quick' as FilterType, label: 'Quick notes' },
    { id: 'passwords' as FilterType, label: 'Passwords' },
    { id: 'favorites' as FilterType, label: 'Favorites' },
  ];

  const filteredNotes = useMemo(() => {
    let result = notes;

    // Apply filter
    if (activeFilter === 'favorites') {
      result = result.filter((note) => note.is_favorite);
    } else if (activeFilter === 'passwords') {
      result = result.filter((note) => 
        note.tags?.includes('password') || 
        note.title.toLowerCase().includes('password')
      );
    } else if (activeFilter === 'quick') {
      result = result.filter((note) => 
        note.tags?.includes('quick') || 
        !note.content || note.content.length < 100
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content?.toLowerCase().includes(query) ||
          note.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'created') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'edited') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [notes, searchQuery, activeFilter, sortBy]);

  const handleDeleteNote = async (id: string) => {
    await deleteNote.mutateAsync(id);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b border-border"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent h-10 text-base px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/dashboard/new')}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>List view</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy('created')}>
                  Sort by time created
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortBy('edited')}
                  className={cn(sortBy === 'edited' && 'bg-accent text-accent-foreground')}
                >
                  Sort by time edited {sortBy === 'edited' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('title')}>
                  Sort by title
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Filter Chips */}
        <motion.div
          className="px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto scrollbar-hide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                'filter-chip',
                activeFilter === filter.id ? 'filter-chip-active' : 'filter-chip-inactive'
              )}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Notes grid */}
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
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
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                {searchQuery ? 'No notes found' : activeFilter === 'favorites' ? 'No favorites yet' : 'No notes yet'}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Create your first note to get started'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
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
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Floating Action Button */}
        <motion.button
          className="fab"
          onClick={() => navigate('/dashboard/new')}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </DashboardLayout>
  );
}
