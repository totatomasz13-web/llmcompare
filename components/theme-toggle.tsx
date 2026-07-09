'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cycle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const current = !mounted ? 'dark' : theme === 'system' ? resolvedTheme : theme;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Zmień motyw (obecny: ${theme ?? 'system'})`}
      title={`Motyw: ${theme ?? 'system'} — kliknij aby zmienić`}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:border-primary/50 hover:shadow-glow-sm',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {current === 'dark' ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Moon className="h-5 w-5 text-violet-300" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Sun className="h-5 w-5 text-amber-500" />
          </motion.span>
        )}
      </AnimatePresence>
      {mounted && theme === 'system' && (
        <Monitor className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-background p-0.5 text-muted-foreground" />
      )}
    </button>
  );
}
