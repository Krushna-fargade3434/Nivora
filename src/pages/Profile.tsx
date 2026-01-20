import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

export default function Profile() {
  const { user } = useAuth();
  const { notes } = useNotes();
  const { profile, updateAvatar } = useProfile();
  const [open, setOpen] = useState(false);

  const avatarOptions = [
    '/avatars/photo1.png',
    '/avatars/photo2.png',
    '/avatars/photo3.png',
    '/avatars/photo4.png',
    '/profile.png',
  ];

  const stats = [
    { label: 'Total Notes', value: notes.length },
    { label: 'Favorites', value: notes.filter((n) => n.is_favorite).length },
    { label: 'Pinned', value: notes.filter((n) => n.is_pinned).length },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div
          className="bg-card rounded-2xl border border-border/50 shadow-soft overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Header section */}
          <div className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary/20 flex items-center justify-center">
                <img 
                  src={profile?.avatar_url || '/profile.png'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <User className="w-10 h-10 text-primary hidden" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {user?.user_metadata?.full_name || 'User'}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <Pencil className="w-4 h-4" />
                    Edit Photo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select a profile avatar</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-5 gap-4">
                    {avatarOptions.map((url) => (
                      <button
                        key={url}
                        onClick={async () => {
                          await updateAvatar.mutateAsync(url);
                          setOpen(false);
                        }}
                        className="rounded-xl overflow-hidden border hover:border-primary focus:outline-none"
                        aria-label={`Choose avatar ${url}`}
                      >
                        <img src={url} alt="Avatar option" className="w-full h-20 object-cover" />
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 divide-x divide-border border-t border-b border-border">
            {stats.map((stat) => (
              <div key={stat.label} className="p-6 text-center">
                <p className="font-display text-2xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member since</p>
                <p className="font-medium">
                  {user?.created_at
                    ? format(new Date(user.created_at), 'MMMM d, yyyy')
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="font-medium text-primary">Verified & Secure</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
