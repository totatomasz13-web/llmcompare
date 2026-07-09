'use client';

import * as React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODELS, type LLMModel, type ModelCategory, type UseCase } from '@/data/models';
import { USE_CASES_INFO } from '@/data/models';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onResults?: (results: LLMModel[]) => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
  initialQuery?: string;
}

export function SearchBar({
  onResults,
  placeholder = 'Szukaj modelu, twórcy, zastosowania...',
  className,
  showFilters = true,
  initialQuery = '',
}: SearchBarProps) {
  const [query, setQuery] = React.useState(initialQuery);
  const [category, setCategory] = React.useState<ModelCategory | 'all'>('all');
  const [useCase, setUseCase] = React.useState<UseCase | 'all'>('all');
  const [showFiltersPanel, setShowFiltersPanel] = React.useState(false);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return MODELS.filter((m) => {
      if (category !== 'all' && m.category !== category) return false;
      if (useCase !== 'all' && !m.useCases.includes(useCase)) return false;
      if (!q) return true;
      const hay = `${m.name} ${m.creator} ${m.description} ${m.useCases.join(' ')} ${m.license ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, category, useCase]);

  React.useEffect(() => {
    onResults?.(results);
  }, [results, onResults]);

  const activeFilters = (category !== 'all' ? 1 : 0) + (useCase !== 'all' ? 1 : 0);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Wyszukaj modele LLM"
          className="w-full rounded-xl border border-border bg-card/50 py-3 pl-11 pr-24 text-sm backdrop-blur-sm transition-all placeholder:text-muted-foreground/70 focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="absolute inset-y-0 right-2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Wyczyść wyszukiwanie"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {showFilters && (
            <button
              type="button"
              onClick={() => setShowFiltersPanel((v) => !v)}
              aria-label="Pokaż filtry"
              aria-expanded={showFiltersPanel}
              className={cn(
                'relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                showFiltersPanel || activeFilters > 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              )}
            >
              <Filter className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filtry</span>
              {activeFilters > 0 && (
                <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white/20 px-1 text-[10px] font-bold">
                  {activeFilters}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && showFiltersPanel && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid gap-4 rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Kategoria
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(['all', 'open-source', 'paid'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                        category === c
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                      )}
                    >
                      {c === 'all' ? 'Wszystkie' : c === 'open-source' ? 'Open Source' : 'API'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Zastosowanie
                </label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUseCase('all')}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                      useCase === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                    )}
                  >
                    Wszystkie
                  </button>
                  {Object.entries(USE_CASES_INFO)
                    .slice(0, 7)
                    .map(([key, info]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setUseCase(key as UseCase)}
                        className={cn(
                          'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                          useCase === key
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                        )}
                      >
                        {info.label}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {onResults && (
        <div className="mt-2 text-xs text-muted-foreground">
          Znaleziono <span className="font-bold text-foreground">{results.length}</span> modeli
        </div>
      )}
    </div>
  );
}
