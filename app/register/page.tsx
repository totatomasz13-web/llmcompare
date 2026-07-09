'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

const passwordRules = [
  { test: (p: string) => p.length >= 8, label: 'Min. 8 znaków' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'Wielka litera' },
  { test: (p: string) => /[a-z]/.test(p), label: 'Mała litera' },
  { test: (p: string) => /[0-9]/.test(p), label: 'Cyfra' },
];

export default function RegisterPage() {
  const { user, register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) router.replace('/profile');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await register({
      email,
      username,
      password,
      displayName: displayName || username,
    });
    setSubmitting(false);
    if (result.ok) {
      router.replace('/profile');
    } else {
      setError(result.error || 'Błąd rejestracji');
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Utwórz konto</h1>
          <p className="mt-1 text-sm text-muted-foreground">Dołącz do społeczności LLM Compare</p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="jan@example.com"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium">Nazwa użytkownika</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="username" type="text" autoComplete="username" required
                  minLength={3} maxLength={24} pattern="[a-zA-Z0-9_-]+"
                  value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="jan_kowalski"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">3–24 znaki, litery, cyfry, _ i -</p>
            </div>

            <div>
              <label htmlFor="displayName" className="mb-1.5 block text-sm font-medium">Nazwa wyświetlana <span className="text-muted-foreground">(opcjonalnie)</span></label>
              <input
                id="displayName" type="text" maxLength={64}
                value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jan Kowalski"
                className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Hasło</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 znaków"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <ul className="mt-2 space-y-1 text-[11px]">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <li key={rule.label} className={cn('flex items-center gap-1.5', passed ? 'text-emerald-500' : 'text-muted-foreground')}>
                        {passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {error && (
              <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-glow-lg disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Utwórz konto <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Masz już konto?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Zaloguj się
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
