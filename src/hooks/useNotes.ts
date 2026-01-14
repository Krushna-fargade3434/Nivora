import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  bg_color: string;
  bg_image_url: string | null;
  is_favorite: boolean;
  is_pinned: boolean;
  tags: string[];
  note_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  bg_color?: string;
  bg_image_url?: string;
  is_favorite?: boolean;
  is_pinned?: boolean;
  tags?: string[];
  note_date?: string;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
  id: string;
}

export function useNotes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
    enabled: !!user,
  });

  const createNote = useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: input.title,
          content: input.content || '',
          bg_color: input.bg_color || '#ffffff',
          bg_image_url: input.bg_image_url,
          is_favorite: input.is_favorite || false,
          is_pinned: input.is_pinned || false,
          tags: input.tags || [],
          note_date: input.note_date || new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create note: ' + error.message);
    },
  });

  const updateNote = useMutation({
    mutationFn: async (input: UpdateNoteInput) => {
      const { id, ...updates } = input;

      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update note: ' + error.message);
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete note: ' + error.message);
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ id, is_favorite }: { id: string; is_favorite: boolean }) => {
      const { data, error } = await supabase
        .from('notes')
        .update({ is_favorite: !is_favorite })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const togglePin = useMutation({
    mutationFn: async ({ id, is_pinned }: { id: string; is_pinned: boolean }) => {
      const { data, error } = await supabase
        .from('notes')
        .update({ is_pinned: !is_pinned })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    error: notesQuery.error,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    togglePin,
  };
}
