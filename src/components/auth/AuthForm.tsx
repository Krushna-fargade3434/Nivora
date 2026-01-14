import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
});

export function AuthForm() {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get('mode') === 'signup';
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate input
      const schema = isSignUp ? signUpSchema : signInSchema;
      const data = isSignUp ? { email, password, fullName } : { email, password };
      
      const result = schema.safeParse(data);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      // Perform auth action
      let error: Error | null;
      if (isSignUp) {
        const response = await signUp(email, password, fullName);
        error = response.error;
      } else {
        const response = await signIn(email, password);
        error = response.error;
      }

      if (error) {
        // Handle specific error messages
        if (error.message.includes('already registered')) {
          setErrors({ email: 'This email is already registered. Please sign in.' });
        } else if (error.message.includes('Invalid login credentials')) {
          setErrors({ password: 'Invalid email or password. Please try again.' });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{ background: 'var(--gradient-hero)' }}
      />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back button */}
        <Link
          to="/"
          className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </Link>

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img src="/logo.png" alt="Nivora" className="w-10 h-10 rounded-xl" />
          <span className="font-display text-2xl font-semibold">Nivora</span>
        </Link>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-card p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
                  {isSignUp ? 'Create your account' : 'Welcome back'}
                </h1>
                <p className="text-muted-foreground">
                  {isSignUp 
                    ? 'Start securing your notes today' 
                    : 'Sign in to access your notes'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {errors.general && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {errors.general}
                  </div>
                )}

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-11 h-12 rounded-xl"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 rounded-xl"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-12 rounded-xl"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-base"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'Create Account' : 'Sign In'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link
                to={isSignUp ? '/auth' : '/auth?mode=signup'}
                className="text-primary font-medium hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
