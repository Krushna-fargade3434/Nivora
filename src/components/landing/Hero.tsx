import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden px-4">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between py-6 max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Scriblet" className="w-10 h-10 rounded-xl" />
          <span className="font-display text-2xl font-semibold">Scriblet</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/auth?mode=signup">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <img src="/logo.png" alt="" className="w-4 h-4 rounded" />
              <span>End-to-end secure storage</span>
            </div>
          </motion.div>

          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold text-foreground leading-tight mb-6"
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
           >
             All Your Important Notes.{' '}
             <span className="text-gradient">One Secure Place.</span>
           </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Store credentials, rankings, reminders, and personal information with 
            military-grade encryption. Beautiful, fast, and always accessible.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <Button asChild size="lg" className="h-14 px-8 text-base rounded-full shadow-elevated hover:shadow-card transition-all">
              <Link to="/auth?mode=signup">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base rounded-full">
              <Link to="/auth">
                Sign In
              </Link>
            </Button>
          </motion.div>

          <motion.p
            className="mt-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            No credit card required • Free forever for personal use
          </motion.p>
        </div>
      </div>
    </section>
  );
}
