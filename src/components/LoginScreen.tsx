import { useState, FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const ALLOWED_EMAIL = 'kylemvidrine@gmail.com';

export const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email !== ALLOWED_EMAIL) {
      setError('This email is not authorized to access this app.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 px-5">
      <div className="glass rounded-3xl p-10 text-center max-w-md w-full">
        <h2 className="text-foreground text-2xl font-semibold mb-5">
          Robo South LA
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="Email address"
            className="w-full px-5 py-3 border-2 border-white/30 bg-white/10 text-foreground rounded-full text-base outline-none placeholder:text-white/50 focus:border-primary transition-colors"
            autoComplete="email"
            autoFocus
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Password"
            className="w-full px-5 py-3 border-2 border-white/30 bg-white/10 text-foreground rounded-full text-base outline-none placeholder:text-white/50 focus:border-primary transition-colors"
            autoComplete="current-password"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3 text-base font-semibold transition-transform active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        {error && (
          <p className="text-destructive mt-2.5 text-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
