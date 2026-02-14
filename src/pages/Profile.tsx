import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, Pencil, Info } from 'lucide-react';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { APP_VERSION } from '@/lib/version';

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
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div
          className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Header section */}
          <div className="p-5 sm:p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-card border-2 border-primary/20 flex items-center justify-center shadow-sm">
                <img 
                  src={profile?.avatar_url || '/profile.png'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <User className="w-10 h-10 text-primary/60 hidden" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-1">
                  {user?.user_metadata?.full_name || 'User'}
                </h2>
                <p className="text-muted-foreground break-words text-sm">
                  {user?.email}
                </p>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto sm:ml-auto border-primary/30 hover:border-primary hover:bg-primary/5">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Select a profile avatar</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
                    {avatarOptions.map((url) => (
                      <button
                        key={url}
                        onClick={async () => {
                          await updateAvatar.mutateAsync(url);
                          setOpen(false);
                        }}
                        className="rounded-xl overflow-hidden border-2 border-border hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        aria-label={`Choose avatar ${url}`}
                      >
                        <img src={url} alt="Avatar option" className="w-full h-16 sm:h-20 object-cover" />
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-b border-border divide-y sm:divide-y-0 sm:divide-x divide-border bg-muted/30">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4 sm:p-6 text-center">
                <p className="font-display text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="p-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="w-full">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Email</p>
                <p className="font-medium text-foreground break-words">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Member since</p>
                <p className="font-medium text-foreground">
                  {user?.created_at
                    ? format(new Date(user.created_at), 'MMMM d, yyyy')
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Account Status</p>
                <p className="font-semibold text-primary">Verified & Secure</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">App Version</p>
                <p className="font-medium text-foreground">
                  v{APP_VERSION}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
