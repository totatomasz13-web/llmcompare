'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Brain,
  Code2,
  PenTool,
  Calculator,
  Eye,
  Server,
  Cpu,
  Globe,
  BookOpen,
  Trophy,
  CheckCircle2,
  TrendingUp,
  Users,
  GitCompare,
  BarChart3,
  Coins,
} from 'lucide-react';
import { ModelCard } from '@/components/model-card';
import { MODELS, USE_CASES_INFO, getTopN, getBestFor } from '@/data/models';
import type { UseCase } from '@/data/models';

const USE_CASE_ICONS: Record<UseCase, React.ComponentType<{ className?: string }>> = {
  coding: Code2,
  writing: PenTool,
  math: Calculator,
  vision: Eye,
  local: Server,
  'low-end': Cpu,
  reasoning: Brain,
  chat: Sparkles,
  multilingual: Globe,
  research: BookOpen,
  chinese: Globe,
  korean: Globe,
  english: Globe,
  agents: Brain,
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-12 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-pattern mask-radial" />
        <div className="absolute inset-0 bg-mesh-1 opacity-60" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="absolute right-0 top-40 -z-10 h-[400px] w-[400px] rounded-full bg-fuchsia-500/15 blur-[120px]" />
        <div className="absolute left-0 top-60 -z-10 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-muted-foreground">
              Aktualizowane na bieżąco • {MODELS.length} modeli w bazie
            </span>
          </motion.div>

          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Porównaj{' '}
            <span className="gradient-text">najlepsze modele AI</span>
            <br className="hidden sm:block" /> w jednym miejscu
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Profesjonalny portal do porównywania modeli LLM — Open Source i API. Rankingi,
            wykresy, rekomendacje i szczegółowe analizy, które pomogą Ci wybrać idealny model
            do Twojego projektu.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/ranking"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-glow-lg"
            >
              <Trophy className="h-4 w-4" />
              Zobacz ranking
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/best-for"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card"
            >
              <Brain className="h-4 w-4" />
              Najlepszy do...
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card"
            >
              <GitCompare className="h-4 w-4" />
              Porównaj
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { value: MODELS.length.toString(), label: 'Modeli w bazie', icon: Brain, color: 'from-violet-500 to-fuchsia-500' },
            { value: MODELS.filter((m) => m.category === 'open-source').length.toString(), label: 'Open Source', icon: Code2, color: 'from-emerald-500 to-cyan-500' },
            { value: MODELS.filter((m) => m.category === 'paid').length.toString(), label: 'Modele API', icon: Zap, color: 'from-amber-500 to-orange-500' },
            { value: '10+', label: 'Kryteriów oceny', icon: BarChart3, color: 'from-pink-500 to-rose-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/60"
            >
              <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${stat.color} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
              <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-extrabold tabular-nums sm:text-3xl">{stat.value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function TopModelsSection() {
  const topAll = getTopN(6, 'rating');
  const topOS = MODELS.filter((m) => m.category === 'open-source').sort((a, b) => b.rating - a.rating).slice(0, 3);
  const topPaid = MODELS.filter((m) => m.category === 'paid').sort((a, b) => b.rating - a.rating).slice(0, 3);
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Trophy className="h-3 w-3" /> Top modele
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Najlepiej oceniane modele
            </h2>
            <p className="mt-2 text-muted-foreground">
              Rankingi podzielone na Open Source (skala 1-10) i API (skala 1-100).
            </p>
          </div>
          <Link
            href="/ranking"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Zobacz pełny ranking
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/30 p-5 backdrop-blur-sm sm:p-6">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  <Code2 className="h-3 w-3" /> Open Source
                </div>
                <h3 className="text-lg font-bold">Top Open Source</h3>
                <p className="text-xs text-muted-foreground">Skala ocen 1-10</p>
              </div>
              <Link href="/open-source" className="text-xs font-semibold text-primary hover:underline">Wszystkie →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topOS.map((m, i) => <ModelCard key={m.id} model={m} index={i} />)}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card/30 p-5 backdrop-blur-sm sm:p-6">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  <Coins className="h-3 w-3" /> API
                </div>
                <h3 className="text-lg font-bold">Top API</h3>
                <p className="text-xs text-muted-foreground">Skala ocen 1-100</p>
              </div>
              <Link href="/paid" className="text-xs font-semibold text-primary hover:underline">Wszystkie →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topPaid.map((m, i) => <ModelCard key={m.id} model={m} index={i} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BestForSection() {
  const featured: UseCase[] = ['coding', 'writing', 'math', 'local', 'low-end', 'vision'];
  return (
    <section className="relative py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-500">
            <Brain className="h-3 w-3" /> Rekomendacje AI
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Najlepszy model do...
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Sprawdź, który model najlepiej sprawdzi się w Twoim konkretnym zastosowaniu.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((uc, i) => {
            const info = USE_CASES_INFO[uc];
            const best = getBestFor(uc);
            const Icon = USE_CASE_ICONS[uc];
            return (
              <motion.div
                key={uc}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={`/best-for/${uc}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-glow"
                >
                  <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${info.color} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${info.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">{info.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{info.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Rekomendacja
                      </div>
                      <div className="font-semibold">{best.name}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: 'Wykresy porównawcze',
      desc: 'Interaktywne wykresy radarowe, słupkowe i punktowe pokazujące mocne strony każdego modelu.',
    },
    {
      icon: GitCompare,
      title: 'Bezpośrednie porównania',
      desc: 'Porównaj do 4 modeli obok siebie — jakość, cena, szybkość, kontekst i wiele więcej.',
    },
    {
      icon: TrendingUp,
      title: 'Aktualne dane',
      desc: 'Baza jest regularnie aktualizowana o najnowsze modele i zmiany cen.',
    },
    {
      icon: Users,
      title: 'Rekomendacje społeczności',
      desc: 'Oceny oparte na benchmarkach i doświadczeniach tysięcy deweloperów.',
    },
    {
      icon: Sparkles,
      title: 'Tryb jasny i ciemny',
      desc: 'Pełne wsparcie dla obu motywów z płynnymi przejściami. Twoje oczy Ci podziękują.',
    },
    {
      icon: CheckCircle2,
      title: 'W 100% open source',
      desc: 'Cały kod projektu jest otwarty. Możesz go rozwijać i dostosowywać do swoich potrzeb.',
    },
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-500">
            <Sparkles className="h-3 w-3" /> Funkcje portalu
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Wszystko, czego potrzebujesz
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Nowoczesne narzędzia, które pomagają świadomie wybrać model LLM.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/40"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 ring-1 ring-primary/20">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 p-8 sm:p-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl" />

          <div className="relative text-center">
            <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              Gotowy, by wybrać{' '}
              <span className="gradient-text">idealny model</span>?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Zacznij od rankingu, porównaj modele lub skorzystaj z naszych rekomendacji.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/ranking"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-glow-lg"
              >
                Zobacz ranking
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/open-source"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold transition-all hover:border-primary/50"
              >
                <Code2 className="h-4 w-4" />
                Open Source
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
