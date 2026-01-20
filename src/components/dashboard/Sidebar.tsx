import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Plus, 
  Star, 
  User, 
  LogOut,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';

const navItems = [
  { icon: FileText, label: 'All Notes', path: '/dashboard' },
  { icon: Plus, label: 'Create Note', path: '/dashboard/new' },
  { icon: Star, label: 'Favorites', path: '/dashboard/favorites' },
  { icon: User, label: 'Profile', path: '/dashboard/profile' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-sidebar border-r border-sidebar-border flex flex-col overflow-y-auto",
          "lg:translate-x-0 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Nivora" className="w-9 h-9 rounded-lg" />
            <span className="font-display text-xl font-semibold">Nivora</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                        layoutId="activeNav"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-3 rounded-xl bg-sidebar-accent/50">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center shrink-0">
              <img 
                src={profile?.avatar_url || '/profile.png'} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <User className="w-5 h-5 text-primary hidden" />
            </div>
            <div className="min-w-0 w-full sm:w-auto">
              <p className="text-sm font-medium truncate">{user?.user_metadata?.full_name || 'User'}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 sm:mt-0 w-full sm:w-auto sm:ml-auto"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
