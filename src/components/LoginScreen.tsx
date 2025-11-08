import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setPassword('');
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
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Enter password"
            className="w-full px-5 py-3 border-2 border-white/30 bg-white/10 text-foreground rounded-full text-base outline-none placeholder:text-white/50 focus:border-primary transition-colors"
            autoComplete="current-password"
            autoFocus
          />
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3 text-base font-semibold transition-transform active:scale-95"
          >
            Login
          </Button>
        </form>
        {error && (
          <p className="text-destructive mt-2.5 text-sm">
            Incorrect password. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};
