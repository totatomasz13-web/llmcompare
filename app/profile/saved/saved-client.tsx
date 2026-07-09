'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, LayoutDashboard, GitCompare, Trash2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SavedComparisonsClient({ items: initial }: { items: any[] }) {
  const router = useRouter();
  const [items, setItems] = React.useState(initial);

  const remove = async (id: string) => {
    setItems((arr) => arr.filter((c) => c.id !== id));
    await fetch(`/api/comparisons?id=${id}`, { method: 'DELETE' });
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Profil
        </Link>
        <div className="mt-4 mb-8">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-500">
            <LayoutDashboard className="h-3 w-3" /> Porównania
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Zapisane porównania</h1>
          <p className="mt-2 text-muted-foreground">{items.length} {items.length === 1 ? 'porównanie' : 'porównań'}</p>
        </div>

        {items.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 text-center">
            <GitCompare className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="font-semibold">Brak zapisanych porównań</p>
            <p className="mt-1 text-sm text-muted-foreground">Zapisz swoje porównania, by mieć do nich dostęp</p>
            <Link href="/compare" className="mt-4 text-sm font-semibold text-primary hover:underline">Stwórz porównanie →</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((c, i) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="group relative rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm transition-all hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold">{c.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {c.models.length} modeli · {new Date(c.updatedAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    aria-label="Usuń porównanie"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.models.map((m: any) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-xs"
                    >
                      <div className={cn('h-3 w-0.5 rounded-full bg-gradient-to-b', m.color)} />
                      {m.name}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex justify-end">
                  <Link
                    href={`/compare?ids=${c.modelIds.join(',')}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Otwórz <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
