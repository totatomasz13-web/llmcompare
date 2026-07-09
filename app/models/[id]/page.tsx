'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Building2,
  Calendar,
  Hash,
  Zap,
  Cpu,
  Coins,
  FileCode,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Globe,
  Award,
  Heart,
  Brain,
  Code2,
  PenTool,
  Calculator,
  Eye,
  Server,
  MessageSquare,
  BookOpen,
  Gauge,
} from 'lucide-react';
import { MODELS, formatContext, formatPrice, USE_CASES_INFO } from '@/data/models';
import type { UseCase } from '@/data/models';
import { BarCompare, RadarCompare } from '@/components/charts';
import { ModelCard } from '@/components/model-card';
import { FavoriteButton } from '@/components/favorite-button';
import { ReviewForm } from '@/components/review-form';
import { ViewTracker } from '@/components/view-tracker';
import { cn, formatRating } from '@/lib/utils';

const USE_CASE_ICONS: Record<UseCase, React.ComponentType<{ className?: string }>> = {
  coding: Code2,
  writing: PenTool,
  math: Calculator,
  vision: Eye,
  local: Server,
  'low-end': Cpu,
  reasoning: Brain,
  chat: MessageSquare,
  multilingual: Globe,
  research: BookOpen,
  chinese: Globe,
  korean: Globe,
  english: Globe,
  agents: Brain,
};

interface PageProps {
  params: { id: string };
}

export default function ModelDetailPage({ params }: PageProps) {
  const model = MODELS.find((m) => m.id === params.id);
  if (!model) notFound();

  const isPaid = model.category === 'paid';
  const related = MODELS.filter((m) => m.id !== model.id && m.category === model.category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="relative">
      <ViewTracker modelId={model.id} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <Link
          href="/ranking"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Ranking
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider',
                    isPaid
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-300'
                      : 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-600 ring-1 ring-emerald-500/30 dark:text-emerald-300'
                  )}
                >
                  {isPaid ? <Coins className="h-3 w-3" /> : <FileCode className="h-3 w-3" />}
                  {isPaid ? 'API / Płatny' : 'Open Source'}
                </span>
                {model.rating >= 4.7 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-3 py-1 text-xs font-semibold text-yellow-600 ring-1 ring-yellow-500/30 dark:text-yellow-300">
                    <Award className="h-3 w-3" /> Top model
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(model.releaseDate).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className={cn('h-20 w-1.5 rounded-full bg-gradient-to-b', model.color)} />
                <div>
                  <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
                    {model.name}
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-lg text-muted-foreground">
                    <Building2 className="h-4 w-4" /> {model.creator}
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {model.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {(() => {
                  const r = formatRating(model);
                  return (
                    <div className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/20 px-3 py-2">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-lg font-bold tabular-nums">{r.value}</span>
                      <span className="text-sm text-muted-foreground">/ {r.max}</span>
                    </div>
                  );
                })()}
                <div className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-3 py-2">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-medium">{model.popularity}% popularności</span>
                </div>
                <FavoriteButton modelId={model.id} size="md" />
                {model.websiteUrl && (
                  <a
                    href={model.websiteUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/50 px-3 py-2 text-sm font-medium transition-all hover:border-primary/50"
                  >
                    <Globe className="h-4 w-4" />
                    Strona producenta
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm"
            >
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {isPaid ? 'Cena API' : 'Dostępność'}
              </h2>
              {isPaid && model.pricePerMillion ? (
                <div className="space-y-3">
                  <PriceRow label="Input" value={model.pricePerMillion.input} />
                  <PriceRow label="Output" value={model.pricePerMillion.output} />
                  <div className="border-t border-border/60 pt-3">
                    <div className="text-xs text-muted-foreground">Przykładowy koszt (100K input + 100K output)</div>
                    <div className="mt-1 font-mono text-2xl font-bold tabular-nums">
                      ${((model.pricePerMillion.input + model.pricePerMillion.output) * 0.1).toFixed(2)}
                    </div>
                  </div>
                  {model.apiProvider && (
                    <div className="border-t border-border/60 pt-3 text-xs">
                      <div className="text-muted-foreground">Dostępne przez</div>
                      <div className="mt-0.5 font-medium">{model.apiProvider}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      Open Source
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Możesz uruchomić lokalnie bez opłat
                    </div>
                  </div>
                  {model.license && (
                    <div className="mt-3 text-xs">
                      <div className="text-muted-foreground">Licencja</div>
                      <div className="mt-0.5 font-mono text-sm font-medium">{model.license}</div>
                    </div>
                  )}
                  <div className="mt-3 text-xs">
                    <div className="text-muted-foreground">Wymagania sprzętowe</div>
                    <div className="mt-0.5 text-sm font-medium">{model.hardwareRequirements}</div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard icon={Hash} label="Parametry" value={model.parameters ?? 'Brak danych'} />
            <MetricCard icon={Zap} label="Kontekst" value={formatContext(model.contextWindow)} highlight />
            <MetricCard icon={Gauge} label="Szybkość" value={`${model.speed}/10`} />
            <MetricCard icon={Cpu} label="Jakość" value={`${model.quality}/100`} />
          </div>
        </motion.section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm"
          >
            <h2 className="mb-4 text-lg font-bold">Mocne strony</h2>
            <ul className="space-y-2.5">
              {model.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm"
          >
            <h2 className="mb-4 text-lg font-bold">Słabe strony</h2>
            <ul className="space-y-2.5">
              {model.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">Wyniki w kluczowych obszarach</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ScoreRow label="Jakość" value={model.quality} color={model.color} />
            <ScoreRow label="Programowanie" value={model.coding} color={model.color} />
            <ScoreRow label="Matematyka" value={model.math} color={model.color} />
            <ScoreRow label="Pisanie" value={model.writing} color={model.color} />
            <ScoreRow label="Rozumowanie" value={model.reasoning} color={model.color} />
            <ScoreRow label="Szybkość" value={model.speed * 10} color={model.color} suffix="/100" />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">Profil umiejętności</h2>
          <div className="rounded-2xl border border-border bg-card/30 p-4 backdrop-blur-sm sm:p-6">
            <RadarCompare models={[model]} height={360} />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">Zastosowania</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {model.useCases.map((uc) => {
              const info = USE_CASES_INFO[uc];
              const Icon = USE_CASE_ICONS[uc];
              return (
                <Link
                  key={uc}
                  href={`/best-for/${uc}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card/30 p-4 transition-all hover:border-primary/40 hover:bg-card/60"
                >
                  <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br', info.color)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{info.label}</div>
                    <div className="truncate text-xs text-muted-foreground">{info.description}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <ReviewForm modelId={model.id} />
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-lg font-bold">Podobne modele</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((m, i) => (
                <ModelCard key={m.id} model={m} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function MetricCard({
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
    <div className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div
        className={cn(
          'mt-1 text-2xl font-extrabold tabular-nums',
          highlight && 'bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent'
        )}
      >
        {value}
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  value,
  color,
  suffix,
}: {
  label: string;
  value: number;
  color: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/30 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-sm font-bold tabular-nums">
          {value}{suffix ?? '/100'}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={cn('h-full rounded-full bg-gradient-to-r', color)}
        />
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-muted-foreground">{label} / 1M tok.</span>
      <span className="font-mono text-lg font-bold tabular-nums">${value.toFixed(2)}</span>
    </div>
  );
}
