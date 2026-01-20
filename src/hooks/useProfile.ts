import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ProfileRow {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as ProfileRow | null;
    },
    enabled: !!user,
  });

  const updateAvatar = useMutation({
    mutationFn: async (avatar_url: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data: existing, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (fetchError) throw fetchError;

      if (existing) {
        const { data, error } = await supabase
          .from('profiles')
          .update({ avatar_url })
          .eq('user_id', user.id)
          .select()
          .single();
        if (error) throw error;
        return data as ProfileRow;
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({ user_id: user.id, avatar_url })
        .select()
        .single();
      if (error) throw error;
      return data as ProfileRow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile photo updated');
    },
    onError: (error) => {
      toast.error('Failed to update profile: ' + error.message);
    },
  });

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateAvatar,
  };
}