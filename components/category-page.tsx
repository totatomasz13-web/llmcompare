'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Code2, Coins, Sparkles, BarChart3 } from 'lucide-react';
import { ModelCard } from '@/components/model-card';
import { ModelTable } from '@/components/model-table';
import { SearchBar } from '@/components/search-bar';
import { BarCompare } from '@/components/charts';
import { MODELS, type LLMModel, type ModelCategory } from '@/data/models';
import { cn } from '@/lib/utils';

interface CategoryPageProps {
  category: ModelCategory;
  title: React.ReactNode;
  subtitle: string;
  accent: string;
  icon: 'open' | 'paid';
}

export function CategoryPage({ category, title, subtitle, accent, icon }: CategoryPageProps) {
  const [view, setView] = React.useState<'grid' | 'table' | 'chart'>('grid');
  const [searchResults, setSearchResults] = React.useState<LLMModel[] | null>(null);
  const [sortMetric, setSortMetric] = React.useState<'quality' | 'rating' | 'coding'>('quality');

  const baseModels = MODELS.filter((m) => m.category === category);
  const models = searchResults
    ? searchResults.filter((m) => m.category === category)
    : baseModels;

  const Icon = icon === 'open' ? Code2 : Coins;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className={cn(
              'mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
              accent
            )}
          >
            <Icon className="h-3 w-3" />
            {category === 'open-source' ? 'Open Source' : 'API / Płatne'}
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <StatCard label="Modele" value={models.length.toString()} />
          <StatCard
            label="Śr. jakość"
            value={(models.reduce((a, b) => a + b.quality, 0) / Math.max(models.length, 1)).toFixed(0)}
          />
          <StatCard
            label="Twórcy"
            value={new Set(models.map((m) => m.creator)).size.toString()}
          />
          <StatCard
            label="Najlepsza ocena"
            value={Math.max(...models.map((m) => m.rating)).toFixed(1)}
          />
        </motion.div>

        <div className="sticky top-16 z-30 -mx-4 mt-10 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="py-4">
            <SearchBar onResults={setSearchResults} showFilters={false} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{models.length}</span> modeli
              </div>
              <div className="flex items-center gap-2">
                {category === 'paid' && (
                  <select
                    value={sortMetric}
                    onChange={(e) => setSortMetric(e.target.value as typeof sortMetric)}
                    aria-label="Metryka wykresu"
                    className="rounded-lg border border-border bg-card/50 px-3 py-1.5 text-sm backdrop-blur-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="quality">Jakość</option>
                    <option value="rating">Ocena</option>
                    <option value="coding">Programowanie</option>
                  </select>
                )}
                <div className="flex rounded-lg border border-border bg-card/50 p-0.5">
                  <ViewButton current={view} value="grid" onClick={() => setView('grid')} label="Siatka">
                    <Sparkles className="h-4 w-4" />
                  </ViewButton>
                  <ViewButton current={view} value="table" onClick={() => setView('table')} label="Tabela">
                    <BarChart3 className="h-4 w-4" />
                  </ViewButton>
                  <ViewButton current={view} value="chart" onClick={() => setView('chart')} label="Wykres">
                    <BarChart3 className="h-4 w-4" />
                  </ViewButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {models.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 text-center">
              <p className="font-semibold">Brak wyników</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {models.map((m, i) => (
                <ModelCard key={m.id} model={m} index={i} />
              ))}
            </div>
          ) : view === 'table' ? (
            <ModelTable models={models} />
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-sm">
                <h2 className="mb-2 text-lg font-bold">Porównanie {sortMetric === 'quality' ? 'jakości' : sortMetric === 'rating' ? 'ocen' : 'w programowaniu'}</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Im wyższy słupek, tym lepszy wynik w danej kategorii.
                </p>
                <BarCompare models={models} metric={sortMetric} height={Math.max(280, models.length * 35)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3 backdrop-blur-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-2xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}

function ViewButton({
  current,
  value,
  onClick,
  label,
  children,
}: {
  current: string;
  value: 'grid' | 'table' | 'chart';
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={current === value}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors',
        current === value
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}
