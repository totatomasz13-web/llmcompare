'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, History as HistoryIcon, Heart, MessageSquare, Eye, LogIn, UserPlus, LayoutDashboard, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  view: { label: 'Wyświetlono model', icon: Eye, color: 'from-slate-500 to-gray-600' },
  favorite: { label: 'Dodano do ulubionych', icon: Heart, color: 'from-rose-500 to-pink-500' },
  review: { label: 'Dodano recenzję', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
  compare: { label: 'Zapisano porównanie', icon: LayoutDashboard, color: 'from-violet-500 to-fuchsia-500' },
  login: { label: 'Logowanie', icon: LogIn, color: 'from-emerald-500 to-teal-500' },
  register: { label: 'Rejestracja', icon: UserPlus, color: 'from-amber-500 to-orange-500' },
};

export function HistoryClient({ items, modelMap }: { items: any[]; modelMap: Record<string, any> }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Profil
        </Link>
        <div className="mt-4 mb-8">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500">
            <HistoryIcon className="h-3 w-3" /> Historia
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Historia aktywności</h1>
          <p className="mt-2 text-muted-foreground">{items.length} {items.length === 1 ? 'wpis' : 'wpisów'}</p>
        </div>

        {items.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 text-center">
            <HistoryIcon className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="font-semibold">Brak aktywności</p>
            <p className="mt-1 text-sm text-muted-foreground">Twoja aktywność pojawi się tutaj</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-3">
              {items.map((a, i) => {
                const meta = TYPE_META[a.type] || TYPE_META.view;
                const Icon = meta.icon;
                const model = a.modelId ? modelMap[a.modelId] : null;
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.4) }}
                    className="relative flex gap-3 pl-1"
                  >
                    <div className={cn('z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-soft', meta.color)}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 rounded-xl border border-border bg-card/40 p-3 backdrop-blur-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold">{meta.label}</div>
                          {model && (
                            <Link href={`/models/${model.id}`} className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
                              <div className={cn('h-3 w-0.5 rounded-full bg-gradient-to-b', model.color)} />
                              {model.name} <span className="opacity-60">· {model.creator}</span>
                            </Link>
                          )}
                            {a.meta?.name && (
                            <div className="mt-0.5 text-xs text-muted-foreground">&bdquo;{a.meta.name}&ldquo;</div>
                          )}
                          {typeof a.meta?.rating === 'number' && (
                            <div className="mt-1 inline-flex items-center gap-1 text-xs">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> {a.meta.rating}/5
                            </div>
                          )}
                        </div>
                        <time className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {new Date(a.createdAt).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
