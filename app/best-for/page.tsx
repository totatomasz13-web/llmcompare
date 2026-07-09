'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Code2,
  PenTool,
  Calculator,
  Eye,
  Server,
  Cpu,
  MessageSquare,
  Globe,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { USE_CASES_INFO, getBestFor, MODELS } from '@/data/models';
import type { UseCase } from '@/data/models';
import { ModelCard } from '@/components/model-card';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<UseCase, React.ComponentType<{ className?: string }>> = {
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

export default function BestForPage() {
  const useCases = Object.entries(USE_CASES_INFO) as [UseCase, (typeof USE_CASES_INFO)[UseCase]][];
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-500">
            <Brain className="h-3 w-3" /> Najlepszy model do...
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Znajdź <span className="gradient-text">idealny model</span> do swojego zadania
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Wybierz zastosowanie, a pokażemy Ci najlepsze modele — zarówno open source, jak i API.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map(([key, info], i) => {
            const best = getBestFor(key);
            const Icon = ICON_MAP[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={`/best-for/${key}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-glow"
                >
                  <div className={cn('absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-20 blur-3xl transition-opacity group-hover:opacity-40', info.color)} />
                  <div className="relative">
                    <div className={cn('mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br', info.color)}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-xl font-bold">{info.label}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{info.description}</p>

                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Rekomendacja
                        </div>
                        <div className="truncate font-semibold">{best.name}</div>
                        <div className="text-xs text-muted-foreground">{best.creator}</div>
                      </div>
                      <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Najlepsze modele — Top 6</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...MODELS]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 6)
              .map((m, i) => (
                <ModelCard key={m.id} model={m} index={i} />
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
