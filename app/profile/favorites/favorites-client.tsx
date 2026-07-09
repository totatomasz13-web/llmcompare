'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { ModelCard } from '@/components/model-card';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function FavoritesClient({ favorites }: { favorites: any[] }) {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = React.useState(favorites);

  const remove = async (modelId: string) => {
    if (!user) return;
    setItems((arr) => arr.filter((m) => m.id !== modelId));
    await fetch(`/api/favorites?modelId=${encodeURIComponent(modelId)}`, { method: 'DELETE' });
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Profil
        </Link>
        <div className="mt-4 mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-500">
              <Heart className="h-3 w-3" /> Ulubione
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Twoje ulubione modele</h1>
            <p className="mt-2 text-muted-foreground">{items.length} {items.length === 1 ? 'model' : 'modeli'} zapisanych</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 text-center">
            <Heart className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="font-semibold">Brak ulubionych</p>
            <p className="mt-1 text-sm text-muted-foreground">Dodaj modele do ulubionych klikając ikonę serca</p>
            <Link href="/ranking" className="mt-4 text-sm font-semibold text-primary hover:underline">Przeglądaj modele →</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  aria-label={`Usuń ${m.name} z ulubionych`}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 text-rose-500 backdrop-blur-sm transition-colors hover:bg-rose-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <ModelCard model={m} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
