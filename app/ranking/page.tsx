'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, LayoutGrid, Table2, Star, TrendingUp, Award, Sparkles, Code2, Coins, ArrowRight } from 'lucide-react';
import { ModelCard } from '@/components/model-card';
import { ModelTable } from '@/components/model-table';
import { SearchBar } from '@/components/search-bar';
import { MODELS, type LLMModel } from '@/data/models';
import { cn, formatRating } from '@/lib/utils';

type ViewMode = 'grid' | 'table';
type CategoryFilter = 'all' | 'open-source' | 'paid';
type SortMode = 'rating' | 'quality' | 'speed' | 'popularity' | 'recent';

function RankingContent() {
  const [view, setView] = React.useState<ViewMode>('grid');
  const [category, setCategory] = React.useState<CategoryFilter>('all');
  const [sort, setSort] = React.useState<SortMode>('rating');
  const [searchResults, setSearchResults] = React.useState<LLMModel[] | null>(null);
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') || '';

  const filtered = React.useMemo(() => {
    let arr = searchResults ?? MODELS;
    if (category !== 'all') arr = arr.filter((m) => m.category === category);
    return [...arr].sort((a, b) => {
      switch (sort) {
        case 'rating':
          return b.rating - a.rating;
        case 'quality':
          return b.quality - a.quality;
        case 'speed':
          return b.speed - a.speed;
        case 'popularity':
          return b.popularity - a.popularity;
        case 'recent':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
    });
  }, [searchResults, category, sort]);

  const podium = React.useMemo(() => filtered.slice(0, 3), [filtered]);

  const openSourceTop = React.useMemo(
    () => MODELS.filter((m) => m.category === 'open-source').sort((a, b) => b.rating - a.rating).slice(0, 3),
    []
  );
  const paidTop = React.useMemo(
    () => MODELS.filter((m) => m.category === 'paid').sort((a, b) => b.rating - a.rating).slice(0, 3),
    []
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-500">
            <Trophy className="h-3 w-3" /> Ranking
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Ranking <span className="gradient-text">modeli LLM</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Wszystkie {MODELS.length} modeli w jednym miejscu. Rankingi podzielone na Open Source i API.
          </p>
        </motion.div>

        {category === 'all' && (
          <div className="mt-12 space-y-6">
            <PodiumSection
              title="Top Open Source"
              subtitle="Najlepsze modele z otwartym kodem · skala 1-10"
              icon={Code2}
              color="from-emerald-400 to-green-500"
              models={openSourceTop}
              href="/open-source"
            />
            <PodiumSection
              title="Top API"
              subtitle="Najlepsze modele komercyjne · skala 1-100"
              icon={Coins}
              color="from-amber-400 to-orange-500"
              models={paidTop}
              href="/paid"
            />
          </div>
        )}

        {category !== 'all' && podium.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 grid gap-4 sm:grid-cols-3"
          >
            <PodiumCard model={podium[1]} place={2} delay={0.1} />
            <PodiumCard model={podium[0]} place={1} delay={0} featured />
            <PodiumCard model={podium[2]} place={3} delay={0.2} />
          </motion.div>
        )}

        <div className="sticky top-16 z-30 -mx-4 mt-12 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="py-4">
            <SearchBar onResults={setSearchResults} showFilters initialQuery={initialQuery} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <SortButton active={sort === 'rating'} onClick={() => setSort('rating')} icon={Star}>
                  Ocena
                </SortButton>
                <SortButton active={sort === 'quality'} onClick={() => setSort('quality')} icon={Award}>
                  Jakość
                </SortButton>
                <SortButton active={sort === 'speed'} onClick={() => setSort('speed')} icon={TrendingUp}>
                  Szybkość
                </SortButton>
                <SortButton active={sort === 'popularity'} onClick={() => setSort('popularity')} icon={Sparkles}>
                  Popularność
                </SortButton>
                <SortButton active={sort === 'recent'} onClick={() => setSort('recent')} icon={TrendingUp}>
                  Najnowsze
                </SortButton>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-border bg-card/50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setView('grid')}
                    aria-label="Widok siatki"
                    aria-pressed={view === 'grid'}
                    className={cn(
                      'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
                      view === 'grid'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('table')}
                    aria-label="Widok tabeli"
                    aria-pressed={view === 'table'}
                    className={cn(
                      'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
                      view === 'table'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Table2 className="h-4 w-4" />
                  </button>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryFilter)}
                  aria-label="Filtruj kategorię"
                  className="rounded-lg border border-border bg-card/50 px-3 py-1.5 text-sm backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="all">Wszystkie</option>
                  <option value="open-source">Open Source</option>
                  <option value="paid">API</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              Wyświetlanie <span className="font-bold text-foreground">{filtered.length}</span> z {MODELS.length} modeli
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 text-center">
              <Trophy className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="font-semibold">Brak wyników</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Spróbuj zmienić filtry lub wyszukiwarkę
              </p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m, i) => (
                <ModelCard key={m.id} model={m} index={i} />
              ))}
            </div>
          ) : (
            <ModelTable models={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}

function PodiumCard({
  model,
  place,
  delay,
  featured = false,
}: {
  model: LLMModel;
  place: number;
  delay: number;
  featured?: boolean;
}) {
  const medals = ['🥇', '🥈', '🥉'];
  const heights = ['sm:scale-110 sm:-translate-y-2', '', ''];
  const r = formatRating(model);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-primary/40',
        featured && 'sm:order-first border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 via-card/50 to-card/50',
        heights[place - 1]
      )}
    >
      <div className={cn('absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-30 blur-2xl', model.color)} />
      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-3xl">{medals[place - 1]}</span>
          <div className="flex items-center gap-1 rounded-md bg-gradient-to-br from-yellow-400/20 to-amber-500/20 px-2 py-0.5">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-bold tabular-nums">{r.value}</span>
            <span className="text-[10px] text-muted-foreground">/{r.max}</span>
          </div>
        </div>
        <h3 className="truncate text-lg font-bold">{model.name}</h3>
        <p className="text-sm text-muted-foreground">{model.creator}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-md bg-muted/50 px-2 py-0.5">{model.parameters ?? 'API'}</span>
          <span className="rounded-md bg-muted/50 px-2 py-0.5">
            {model.category === 'open-source' ? 'Open Source' : 'API'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function PodiumSection({
  title, subtitle, icon: Icon, color, models, href,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  models: LLMModel[];
  href: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card/30 p-5 backdrop-blur-sm sm:p-6"
    >
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className={cn('mb-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white', color)}>
            <Icon className="h-3 w-3" /> {title}
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Wszystkie <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {models.map((m, i) => (
          <PodiumCard key={m.id} model={m} place={i + 1} delay={i * 0.05} featured={i === 0} />
        ))}
      </div>
    </motion.section>
  );
}

export default function RankingPage() {
  return (
    <Suspense>
      <RankingContent />
    </Suspense>
  );
}

function SortButton({
  active,
  onClick,
  children,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
        active
          ? 'bg-primary text-primary-foreground shadow-soft'
          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="h-3 w-3" />
      {children}
    </button>
  );
}
