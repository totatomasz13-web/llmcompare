'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Star,
  Cpu,
  Zap,
  Hash,
  Calendar,
  Building2,
  ExternalLink,
  Tag,
  Coins,
  FileCode,
  Award,
} from 'lucide-react';
import type { LLMModel } from '@/data/models';
import { formatContext, formatPrice } from '@/data/models';
import { cn, formatRating } from '@/lib/utils';

interface ModelCardProps {
  model: LLMModel;
  index?: number;
  compact?: boolean;
}

export function ModelCard({ model, index = 0, compact = false }: ModelCardProps) {
  const isPaid = model.category === 'paid';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300',
        'hover:border-primary/40 hover:shadow-glow',
        compact ? 'p-4' : 'p-6'
      )}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-px bg-gradient-to-r',
          model.color,
          'opacity-60'
        )}
      />

      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-10 blur-3xl transition-opacity group-hover:opacity-20"
        style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
        data-color={model.color}
      />

      <header className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                isPaid
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-300'
                  : 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-600 ring-1 ring-emerald-500/30 dark:text-emerald-300'
              )}
            >
              {isPaid ? <Coins className="h-3 w-3" /> : <FileCode className="h-3 w-3" />}
              {isPaid ? 'API' : 'Open Source'}
            </span>
            {model.rating >= 4.7 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-yellow-600 ring-1 ring-yellow-500/30 dark:text-yellow-300">
                <Award className="h-3 w-3" /> Top
              </span>
            )}
          </div>
          <h3 className="truncate text-lg font-bold tracking-tight">{model.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            {model.creator}
          </p>
        </div>

        <div className="flex flex-col items-end">
          {(() => {
            const r = formatRating(model);
            return (
              <div className="flex items-center gap-1 rounded-lg bg-gradient-to-br from-yellow-400/20 to-amber-500/20 px-2 py-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-bold tabular-nums">{r.value}</span>
                <span className="text-[10px] text-muted-foreground">/{r.max}</span>
              </div>
            );
          })()}
          {index !== undefined && index < 3 && (
            <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              #{index + 1}
            </div>
          )}
        </div>
      </header>

      {!compact && (
        <p className="relative mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {model.description}
        </p>
      )}

      <dl className="relative mt-4 grid grid-cols-2 gap-3 text-xs">
        <Stat icon={Hash} label="Parametry" value={model.parameters ?? '—'} />
        <Stat icon={Zap} label="Kontekst" value={formatContext(model.contextWindow)} highlight />
        <Stat icon={Calendar} label="Wydanie" value={new Date(model.releaseDate).getFullYear().toString()} />
        <Stat icon={Cpu} label="Szybkość" value={`${model.speed}/10`} />
      </dl>

      {!compact && (
        <>
          <div className="relative mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Jakość</span>
              <span className="text-xs font-bold tabular-nums text-foreground">
                {model.quality}/100
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${model.quality}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className={cn('h-full rounded-full bg-gradient-to-r', model.color)}
              />
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-3 gap-2 text-[10px]">
            <MiniBar label="Kod" value={model.coding} gradient={model.color} />
            <MiniBar label="Math" value={model.math} gradient={model.color} />
            <MiniBar label="Pisanie" value={model.writing} gradient={model.color} />
          </div>

          <div className="relative mt-4 flex flex-wrap gap-1.5">
            {model.useCases.slice(0, 3).map((uc) => (
              <span
                key={uc}
                className="inline-flex items-center rounded-md bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground"
              >
                <Tag className="mr-1 h-2.5 w-2.5" />
                {uc}
              </span>
            ))}
            {model.useCases.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                +{model.useCases.length - 3}
              </span>
            )}
          </div>
        </>
      )}

      <footer className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <div className="text-sm">
          {isPaid ? (
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Cena / 1M tokenów
              </div>
              <div className="font-mono text-sm font-bold">
                {formatPrice(model)}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Licencja
              </div>
              <div className="truncate text-xs font-medium">{model.license}</div>
            </div>
          )}
        </div>
        <Link
          href={`/models/${model.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
        >
          Szczegóły
          <ExternalLink className="h-3 w-3" />
        </Link>
      </footer>
    </motion.article>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-muted/30 px-2.5 py-1.5">
      <dt className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </dt>
      <dd
        className={cn(
          'mt-0.5 truncate text-sm font-semibold tabular-nums',
          highlight && 'bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent'
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function MiniBar({
  label,
  value,
  gradient,
}: {
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div>
      <div className="mb-1 text-center text-[10px] font-medium text-muted-foreground">
        {label}
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={cn('h-full rounded-full bg-gradient-to-r', gradient)}
        />
      </div>
      <div className="mt-0.5 text-center text-[10px] font-bold tabular-nums">{value}</div>
    </div>
  );
}
