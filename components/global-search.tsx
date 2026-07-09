'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Coins, FileCode, ArrowRight, Command } from 'lucide-react';
import { MODELS, type LLMModel } from '@/data/models';
import { cn, formatRating } from '@/lib/utils';

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const results = React.useMemo(() => {
    if (!query.trim()) return MODELS.slice(0, 8);
    const q = query.toLowerCase();
    return MODELS.filter((m) => {
      const hay = `${m.name} ${m.creator} ${m.description} ${(m as any).provider ?? ''}`.toLowerCase();
      return hay.includes(q);
    }).slice(0, 12);
  }, [query]);

  const handleSelect = (id: string) => {
    setOpen(false);
    router.push(`/models/${id}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Wyszukaj modele (Ctrl+K)"
        className="hidden h-10 items-center gap-2 rounded-xl border border-border bg-card/50 px-3 text-sm text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card hover:text-foreground md:inline-flex"
      >
        <Search className="h-4 w-4" />
        <span>Szukaj...</span>
        <kbd className="ml-2 hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono lg:inline-flex">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Wyszukaj"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/50 text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card hover:text-foreground md:hidden"
      >
        <Search className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 px-4 pt-[10vh] backdrop-blur-md"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-border bg-background/50 px-4 py-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Szukaj modelu, twórcy, zastosowania..."
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Wyczyść"
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono">ESC</kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center text-sm text-muted-foreground">
                    <Search className="mb-2 h-6 w-6 opacity-50" />
                    Brak wyników dla „{query}"
                  </div>
                ) : (
                  <>
                    {!query && (
                      <div className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Szybkie wyniki
                      </div>
                    )}
                    {results.map((m) => (
                      <SearchResult key={m.id} model={m} onClick={() => handleSelect(m.id)} query={query} />
                    ))}
                  </>
                )}
              </div>

              {query && results.length > 0 && (
                <div className="border-t border-border bg-background/30 p-2">
                  <Link
                    href={`/ranking?q=${encodeURIComponent(query)}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <span>Zobacz wszystkie wyniki w rankingu</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SearchResult({ model, onClick, query }: { model: LLMModel; onClick: () => void; query: string }) {
  const r = formatRating(model);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
    >
      <div className={cn('h-10 w-1 flex-shrink-0 rounded-full bg-gradient-to-b', model.color)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Highlight text={model.name} query={query} className="truncate text-sm font-bold" />
          {model.category === 'open-source' ? (
            <FileCode className="h-3 w-3 flex-shrink-0 text-emerald-500" />
          ) : (
            <Coins className="h-3 w-3 flex-shrink-0 text-amber-500" />
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Highlight text={(model as any).provider ?? model.creator} query={query} />
          <span>·</span>
          <span>{r.value}/100</span>
          {model.useCases?.[0] && (
            <>
              <span>·</span>
              <span>{model.useCases[0]}</span>
            </>
          )}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

function Highlight({ text, query, className = '' }: { text: string; query: string; className?: string }) {
  if (!query.trim()) return <span className={className}>{text}</span>;
  const q = query.toLowerCase();
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {text.slice(0, idx)}
      <mark className="bg-primary/30 text-foreground rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  );
}
