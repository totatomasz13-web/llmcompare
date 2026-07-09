'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Coins,
  FileCode,
  ExternalLink,
  Building2,
  Zap,
  Hash,
} from 'lucide-react';
import type { LLMModel } from '@/data/models';
import { formatContext, formatPrice } from '@/data/models';
import { cn, formatRating } from '@/lib/utils';

type SortField =
  | 'name'
  | 'creator'
  | 'rating'
  | 'quality'
  | 'speed'
  | 'coding'
  | 'math'
  | 'writing'
  | 'contextWindow'
  | 'releaseDate';

interface ModelTableProps {
  models: LLMModel[];
  initialSort?: { field: SortField; direction: 'asc' | 'desc' };
}

export function ModelTable({ models, initialSort = { field: 'rating', direction: 'desc' } }: ModelTableProps) {
  const [sort, setSort] = React.useState(initialSort);

  const sorted = React.useMemo(() => {
    const arr = [...models];
    arr.sort((a, b) => {
      const av = a[sort.field];
      const bv = b[sort.field];
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      return sort.direction === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [models, sort]);

  const toggleSort = (field: SortField) => {
    setSort((s) => {
      if (s.field === field) return { field, direction: s.direction === 'asc' ? 'desc' : 'asc' };
      const numeric: SortField[] = ['rating', 'quality', 'speed', 'coding', 'math', 'writing', 'contextWindow'];
      return { field, direction: numeric.includes(field) ? 'desc' : 'asc' };
    });
  };

  const SortHeader = ({ field, children, align = 'left' }: { field: SortField; children: React.ReactNode; align?: 'left' | 'right' }) => {
    const active = sort.field === field;
    return (
      <button
        type="button"
        onClick={() => toggleSort(field)}
        className={cn(
          'group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
          align === 'right' && 'justify-end',
          active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {children}
        {active ? (
          sort.direction === 'asc' ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40 group-hover:opacity-100" />
        )}
      </button>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b border-border/60 bg-muted/20">
              <th className="px-4 py-3 text-left">
                <SortHeader field="name">Model</SortHeader>
              </th>
              <th className="hidden px-4 py-3 text-left md:table-cell">
                <SortHeader field="creator">Twórca</SortHeader>
              </th>
              <th className="px-4 py-3 text-right">
                <SortHeader field="rating" align="right">Ocena</SortHeader>
              </th>
              <th className="px-4 py-3 text-right">
                <SortHeader field="quality" align="right">Jakość</SortHeader>
              </th>
              <th className="hidden px-4 py-3 text-right lg:table-cell">
                <SortHeader field="contextWindow" align="right">Kontekst</SortHeader>
              </th>
              <th className="hidden px-4 py-3 text-right lg:table-cell">
                <SortHeader field="speed" align="right">Speed</SortHeader>
              </th>
              <th className="hidden px-4 py-3 text-right sm:table-cell">
                <SortHeader field="coding" align="right">Kod</SortHeader>
              </th>
              <th className="hidden px-4 py-3 text-right md:table-cell">
                <SortHeader field="releaseDate" align="right">Rok</SortHeader>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cena
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Brak modeli spełniających kryteria
                </td>
              </tr>
            ) : (
              sorted.map((m, i) => {
                const isPaid = m.category === 'paid';
                return (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.4) }}
                    className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('h-10 w-1 rounded-full bg-gradient-to-b', m.color)} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-semibold">{m.name}</span>
                            {isPaid ? (
                              <Coins className="h-3 w-3 text-amber-500" />
                            ) : (
                              <FileCode className="h-3 w-3 text-emerald-500" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            {m.creator}
                          </div>
                          {m.parameters && (
                            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Hash className="h-2.5 w-2.5" />
                              {m.parameters}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        {m.creator}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(() => {
                        const r = formatRating(m);
                        return (
                          <div className="inline-flex items-center gap-1 rounded-md bg-gradient-to-br from-yellow-400/20 to-amber-500/20 px-2 py-0.5">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm font-bold tabular-nums">{r.value}</span>
                            <span className="text-[10px] text-muted-foreground">/{r.max}</span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn('h-full bg-gradient-to-r', m.color)}
                            style={{ width: `${m.quality}%` }}
                          />
                        </div>
                        <span className="w-7 text-right text-sm font-semibold tabular-nums">
                          {m.quality}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-right text-sm tabular-nums lg:table-cell">
                      {formatContext(m.contextWindow)}
                    </td>
                    <td className="hidden px-4 py-3 text-right lg:table-cell">
                      <div className="inline-flex items-center gap-1 text-sm tabular-nums">
                        <Zap className="h-3 w-3 text-amber-500" />
                        {m.speed}/10
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-right text-sm tabular-nums sm:table-cell">
                      {m.coding}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-sm tabular-nums text-muted-foreground md:table-cell">
                      {new Date(m.releaseDate).getFullYear()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-mono text-xs">
                        {isPaid ? (
                          <span className="text-foreground">{formatPrice(m)}</span>
                        ) : (
                          <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            FREE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/models/${m.id}`}
                        aria-label={`Szczegóły modelu ${m.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
