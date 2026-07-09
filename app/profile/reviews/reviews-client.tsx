'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Star, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RatingStars } from '@/components/rating-stars';
import { cn } from '@/lib/utils';

export function ReviewsClient({ items: initial }: { items: any[] }) {
  const router = useRouter();
  const [items, setItems] = React.useState(initial);

  const remove = async (id: string) => {
    setItems((arr) => arr.filter((r) => r.id !== id));
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Profil
        </Link>
        <div className="mt-4 mb-8">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
            <MessageSquare className="h-3 w-3" /> Recenzje
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Moje recenzje</h1>
          <p className="mt-2 text-muted-foreground">{items.length} {items.length === 1 ? 'recenzja' : 'recenzji'}</p>
        </div>

        {items.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 text-center">
            <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="font-semibold">Brak recenzji</p>
            <p className="mt-1 text-sm text-muted-foreground">Dodaj recenzję modelu, który testowałeś</p>
            <Link href="/ranking" className="mt-4 text-sm font-semibold text-primary hover:underline">Przeglądaj modele →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((r, i) => (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {r.model && (
                      <Link
                        href={`/models/${r.model.id}`}
                        className="group flex items-center gap-2 text-sm font-semibold hover:text-primary"
                      >
                        <div className={cn('h-6 w-1 rounded-full bg-gradient-to-b', r.model.color)} />
                        <span className="truncate">{r.model.name}</span>
                        <span className="text-xs text-muted-foreground">· {r.model.creator}</span>
                      </Link>
                    )}
                    {r.title && <h3 className="mt-2 text-base font-bold">{r.title}</h3>}
                    <div className="mt-1 flex items-center gap-2">
                      <RatingStars value={r.rating} readonly size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(r.id)}
                    aria-label="Usuń recenzję"
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.content}</p>
                {(r.pros?.length || r.cons?.length) ? (
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    {r.pros?.length > 0 && (
                      <div>
                        <div className="font-semibold text-emerald-500">Plusy</div>
                        <ul className="mt-1 space-y-0.5 text-muted-foreground">
                          {r.pros.map((p: string, j: number) => <li key={j}>+ {p}</li>)}
                        </ul>
                      </div>
                    )}
                    {r.cons?.length > 0 && (
                      <div>
                        <div className="font-semibold text-rose-500">Minusy</div>
                        <ul className="mt-1 space-y-0.5 text-muted-foreground">
                          {r.cons.map((p: string, j: number) => <li key={j}>- {p}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
