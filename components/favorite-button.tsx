'use client';

import * as React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

export function FavoriteButton({ modelId, size = 'md' }: { modelId: string; size?: 'sm' | 'md' | 'lg' }) {
  const { user } = useAuth();
  const [isFav, setIsFav] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [bounce, setBounce] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      setIsFav(false);
      return;
    }
    let cancelled = false;
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setIsFav(data.items?.some((f: any) => f.modelId === modelId) || false);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user, modelId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = `/login?redirect=/models/${modelId}`;
      return;
    }
    setLoading(true);
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
    try {
      if (isFav) {
        await fetch(`/api/favorites?modelId=${encodeURIComponent(modelId)}`, { method: 'DELETE' });
        setIsFav(false);
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ modelId }),
        });
        setIsFav(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  const containers = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
      aria-pressed={isFav}
      className={cn(
        'inline-flex items-center justify-center rounded-xl border transition-all',
        containers[size],
        isFav
          ? 'border-rose-500/50 bg-rose-500/10 text-rose-500'
          : 'border-border bg-card/50 text-muted-foreground hover:border-rose-500/50 hover:text-rose-500'
      )}
    >
      <motion.span
        animate={bounce ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.4 }}
        className="inline-flex"
      >
        <Heart className={cn(sizes[size], isFav && 'fill-rose-500')} />
      </motion.span>
    </button>
  );
}
