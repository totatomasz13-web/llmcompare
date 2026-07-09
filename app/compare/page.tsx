'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Plus, X, Sparkles, CheckCircle2, Coins, FileCode } from 'lucide-react';
import { RadarCompare, BarCompare, PriceVsQuality } from '@/components/charts';
import { MODELS, type LLMModel, formatContext, formatPrice } from '@/data/models';
import { cn } from '@/lib/utils';

const MAX_COMPARE = 4;

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [openSlot, setOpenSlot] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selected = React.useMemo(
    () => selectedIds.map((id) => MODELS.find((m) => m.id === id)!).filter(Boolean),
    [selectedIds]
  );

  const add = (id: string) => {
    if (selectedIds.length >= MAX_COMPARE) return;
    if (selectedIds.includes(id)) return;
    setSelectedIds((s) => [...s, id]);
    setOpenSlot(null);
  };

  const remove = (id: string) => {
    setSelectedIds((s) => s.filter((x) => x !== id));
  };

  const available = MODELS.filter((m) => !selectedIds.includes(m.id));

  React.useEffect(() => {
    if (openSlot === null) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenSlot(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openSlot]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-500">
            <GitCompare className="h-3 w-3" /> Porównaj
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Porównaj modele <span className="gradient-text">obok siebie</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Wybierz do {MAX_COMPARE} modeli i zobacz ich porównanie na interaktywnych wykresach.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-10"
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold">Wybrane modele ({selectedIds.length}/{MAX_COMPARE})</h2>
          </div>
          <div ref={containerRef} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {selected.map((m) => (
              <SelectedCard key={m.id} model={m} onRemove={() => remove(m.id)} canRemove={selectedIds.length > 1} />
            ))}
            {Array.from({ length: Math.max(0, MAX_COMPARE - selectedIds.length) }).map((_, i) => (
              <AddSlot
                key={`empty-${i}`}
                index={i}
                open={openSlot === i}
                onToggle={() => setOpenSlot((v) => (v === i ? null : i))}
                onAdd={add}
                models={available}
              />
            ))}
          </div>
        </motion.div>

        {selected.length >= 2 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="mb-4 text-xl font-bold">Profil umiejętności</h2>
            <div className="rounded-2xl border border-border bg-card/30 p-4 backdrop-blur-sm sm:p-6">
              <RadarCompare models={selected} />
            </div>
          </motion.section>
        )}

        {selected.length >= 1 && (
          <section className="mt-12 space-y-6">
            <h2 className="text-xl font-bold">Szczegółowe porównanie</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <BarCard title="Jakość" models={selected} metric="quality" />
              <BarCard title="Szybkość" models={selected} metric="speed" />
              <BarCard title="Programowanie" models={selected} metric="coding" />
              <BarCard title="Matematyka" models={selected} metric="math" />
              <BarCard title="Pisanie" models={selected} metric="writing" />
              <BarCard title="Ocena" models={selected} metric="rating" />
            </div>
          </section>
        )}

        {selected.length >= 2 && selected.some((m) => m.category === 'paid') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h2 className="mb-4 text-xl font-bold">Cena vs Jakość</h2>
            <div className="rounded-2xl border border-border bg-card/30 p-4 backdrop-blur-sm sm:p-6">
              <PriceVsQuality models={selected} />
            </div>
          </motion.section>
        )}

        {selected.length >= 2 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h2 className="mb-4 text-xl font-bold">Tabela porównawcza</h2>
            <div className="overflow-x-auto rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cecha</th>
                    {selected.map((m) => (
                      <th key={m.id} className="px-4 py-3 text-left">
                        <div className="flex items-center gap-2">
                          <div className={cn('h-8 w-1 rounded-full bg-gradient-to-b', m.color)} />
                          <div>
                            <div className="text-sm font-bold">{m.name}</div>
                            <div className="text-xs text-muted-foreground">{m.creator}</div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <Row label="Kategoria" values={selected.map((m) => m.category === 'open-source' ? 'Open Source' : 'API')} mono={false} />
                  <Row label="Parametry" values={selected.map((m) => m.parameters ?? '—')} />
                  <Row label="Kontekst" values={selected.map((m) => formatContext(m.contextWindow))} />
                  <Row label="Szybkość" values={selected.map((m) => `${m.speed}/10`)} />
                  <Row label="Jakość" values={selected.map((m) => `${m.quality}/100`)} />
                  <Row label="Programowanie" values={selected.map((m) => `${m.coding}/100`)} />
                  <Row label="Matematyka" values={selected.map((m) => `${m.math}/100`)} />
                  <Row label="Pisanie" values={selected.map((m) => `${m.writing}/100`)} />
                  <Row label="Rozumowanie" values={selected.map((m) => `${m.reasoning}/100`)} />
                  <Row label="Ocena" values={selected.map((m) => `⭐ ${m.rating.toFixed(1)}`)} />
                  <Row label="Popularność" values={selected.map((m) => `${m.popularity}/100`)} />
                  <Row
                    label="Cena / 1M tok."
                    values={selected.map((m) =>
                      m.pricePerMillion ? formatPrice(m) : '🆓 Open Source'
                    )}
                  />
                  <Row
                    label="Licencja"
                    values={selected.map((m) => m.license ?? m.apiProvider ?? '—')}
                  />
                  <Row
                    label="Wydany"
                    values={selected.map((m) => new Date(m.releaseDate).toLocaleDateString('pl-PL'))}
                  />
                </tbody>
              </table>
            </div>
          </motion.section>
        )}

        {selected.length < 2 && (
          <div className="mt-12 flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 text-center">
            <Sparkles className="mb-2 h-6 w-6 text-muted-foreground" />
            <p className="font-semibold">Wybierz co najmniej 2 modele</p>
            <p className="text-sm text-muted-foreground">aby zobaczyć porównanie</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SelectedCard({ model, onRemove, canRemove }: { model: LLMModel; onRemove: () => void; canRemove: boolean }) {
  const isPaid = model.category === 'paid';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm"
    >
      <div className={cn('absolute inset-x-0 top-0 h-px bg-gradient-to-r', model.color, 'opacity-60')} />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1">
            {isPaid ? (
              <Coins className="h-3 w-3 text-amber-500" />
            ) : (
              <FileCode className="h-3 w-3 text-emerald-500" />
            )}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {isPaid ? 'API' : 'Open Source'}
            </span>
          </div>
          <div className="truncate text-sm font-bold">{model.name}</div>
          <div className="text-xs text-muted-foreground">{model.creator}</div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
            <span className="rounded bg-muted/50 px-1.5 py-0.5">⭐ {model.rating.toFixed(1)}</span>
            <span className="rounded bg-muted/50 px-1.5 py-0.5">Q: {model.quality}</span>
            <span className="rounded bg-muted/50 px-1.5 py-0.5">S: {model.speed}/10</span>
          </div>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Usuń ${model.name}`}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function AddSlot({
  index,
  open,
  onToggle,
  onAdd,
  models,
}: {
  index: number;
  open: boolean;
  onToggle: () => void;
  onAdd: (id: string) => void;
  models: LLMModel[];
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Dodaj model do porównania"
        aria-expanded={open}
        className="flex h-full min-h-[120px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/20 text-sm font-semibold text-muted-foreground transition-all hover:border-primary/50 hover:bg-card/40 hover:text-foreground"
      >
        <Plus className="h-5 w-5" />
        Dodaj model
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {models.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(m.id);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
              >
                <div className={cn('h-6 w-1 rounded-full bg-gradient-to-b', m.color)} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.creator}</div>
                </div>
                {m.category === 'open-source' ? (
                  <FileCode className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Coins className="h-3 w-3 text-amber-500" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BarCard({
  title,
  models,
  metric,
}: {
  title: string;
  models: LLMModel[];
  metric: 'quality' | 'speed' | 'coding' | 'math' | 'writing' | 'rating';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card/30 p-4 backdrop-blur-sm"
    >
      <h3 className="mb-2 text-sm font-bold">{title}</h3>
      <BarCompare models={models} metric={metric} height={180} />
    </motion.div>
  );
}

function Row({ label, values, mono = true }: { label: string; values: string[]; mono?: boolean }) {
  return (
    <tr className="border-b border-border/40 last:border-0">
      <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={cn('px-4 py-3 text-sm', mono && 'font-mono tabular-nums')}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}
