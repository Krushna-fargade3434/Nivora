import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Nivora" className="w-8 h-8 rounded-lg" />
          <span className="font-display text-xl font-semibold">Nivora</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nivora. All rights reserved.
        </p>

        <div className="flex items-center gap-6 flex-wrap justify-center md:justify-end">
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link to="/auth?mode=signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Get Started
          </Link>
        </div>
      </div>
    </footer>
  );
}
