'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Code2, PenTool, Calculator, Eye, Server, Cpu, Brain, MessageSquare, Globe, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { USE_CASES_INFO, MODELS, getBestFor } from '@/data/models';
import type { UseCase } from '@/data/models';
import { ModelCard } from '@/components/model-card';
import { BarCompare } from '@/components/charts';
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

export default function BestForDetailPage({ params }: { params: Promise<{ useCase: string }> }) {
  const { useCase } = React.use(params) as { useCase: UseCase };
  if (!(useCase in USE_CASES_INFO)) {
    notFound();
  }
  const info = USE_CASES_INFO[useCase];
  const Icon = ICON_MAP[useCase];

  const fieldMap: Record<UseCase, keyof (typeof MODELS)[number]> = {
    coding: 'coding',
    writing: 'writing',
    math: 'math',
    vision: 'quality',
    local: 'speed',
    'low-end': 'speed',
    reasoning: 'reasoning',
    chat: 'quality',
    multilingual: 'quality',
    research: 'quality',
    chinese: 'quality',
    korean: 'quality',
    english: 'quality',
    agents: 'quality',
  };
  const field = fieldMap[useCase];

  const top = [...MODELS]
    .filter((m) => m.useCases.includes(useCase))
    .sort((a, b) => (b[field] as number) - (a[field] as number))
    .slice(0, 6);

  const winner = top[0];
  const osWinner = top.find((m) => m.category === 'open-source');
  const paidWinner = top.find((m) => m.category === 'paid');

  const tips: Record<UseCase, string[]> = {
    coding: [
      'Modele reasoningowe (o1, DeepSeek R1) są najlepsze do złożonych zadań algorytmicznych.',
      'Qwen 2.5 Coder i DeepSeek V3 to świetne darmowe alternatywy.',
      'Claude 3.5 Sonnet jest liderem w programowaniu — świetnie radzi sobie z refaktoryzacją.',
    ],
    writing: [
      'Claude 3.5 Sonnet i GPT-4o to najlepsze wybory do długich, kreatywnych tekstów.',
      'Mistral Large 2 oferuje doskonały styl za darmo.',
      'Do krótkich tekstów (posty, maile) wystarczy GPT-4o mini lub Gemini Flash.',
    ],
    math: [
      'o1 i o1-mini to zdecydowani liderzy w złożonej matematyce.',
      'DeepSeek R1 to najlepsza otwarta alternatywa dla o1.',
      'Qwen 2.5 72B świetnie radzi sobie z matematyką na poziomie akademickim.',
    ],
    vision: [
      'GPT-4o, Claude 3.5 Sonnet i Gemini 1.5 Pro to top modele multimodalne.',
      'Gemini oferuje najdłuższy kontekst do analizy długich dokumentów graficznych.',
      'Lokalnie trudno o dobre modele vision — Llama 3.2 Vision to dobry start.',
    ],
    local: [
      'Llama 3.1 8B to świetny start — działa nawet na RTX 3060.',
      'Mistral 7B i Qwen 2.5 7B to inne doskonałe opcje open source.',
      'Ollama i LM Studio ułatwiają uruchomienie modeli lokalnie.',
    ],
    'low-end': [
      'Phi-3 Mini (3.8B) i Gemma 2 2B to najmniejsze sensowne modele.',
      'Llama 3.2 1B/3B działa nawet na laptopach bez dedykowanego GPU.',
      'Kwantyzacja Q4 pozwala uruchomić większe modele na słabszym sprzęcie.',
    ],
    reasoning: [
      'o1 to absolutny lider w rozumowaniu — użyj go do najtrudniejszych zadań.',
      'DeepSeek R1 to najlepsza otwarta alternatywa dla o1.',
      'Claude 3.5 Sonnet świetnie radzi sobie z rozumowaniem przy codziennych zadaniach.',
    ],
    chat: [
      'GPT-4o, Claude 3.5 Sonnet i Gemini 1.5 Pro oferują najlepsze doświadczenie konwersacyjne.',
      'Llama 3.1 70B to świetna darmowa opcja do hostowania chatbota.',
      'Wybierz model z RLHF — będzie bezpieczniejszy i bardziej pomocny.',
    ],
    multilingual: [
      'Qwen 2.5 (Alibaba) jest liderem w wielojęzyczności, szczególnie w językach azjatyckich.',
      'GPT-4o i Claude obsługują najwięcej języków na najwyższym poziomie.',
      'Llama 3.1 obsługuje 8 głównych języków europejskich i azjatyckich.',
    ],
    research: [
      'Gemini 1.5 Pro z kontekstem 2M tokenów jest idealny do analizy długich dokumentów.',
      'Claude 3.5 Sonnet świetnie radzi sobie z syntezą informacji.',
      'GPT-4o z pluginem web search to potężne narzędzie researchowe.',
    ],
    chinese: [
      'ERNIE 4.5 (Baidu) i Qwen 3 (Alibaba) to liderzy w języku chińskim.',
      'Hunyuan Pro (Tencent) oferuje świetną jakość po chińsku z 256k kontekstem.',
      'Modele azjatyckie znacznie lepiej rozumieją kulturę i idiomy chińskie.',
    ],
    korean: [
      'HyperCLOVA X (Naver) jest liderem w języku koreańskim.',
      'EXAONE 3.5 (LG) oferuje solidną jakość po koreańsku w wersji open source.',
      'Modele koreańskie znacznie lepiej rozumieją kontekst kulturowy.',
    ],
    english: [
      'GPT-4.1, Claude 3.7 Sonnet i Gemini 2.5 Pro to liderzy w języku angielskim.',
      'Modele anglocentryczne zwykle mają najlepsze rozumienie niuansów języka.',
      'Większość modeli open source jest też świetna po angielsku.',
    ],
    agents: [
      'Kimi K2 (Moonshot) i Llama 4 Maverick świetnie radzą sobie z używaniem narzędzi.',
      'Modele reasoningowe (o1, Claude 3.7) są lepsze w planowaniu złożonych akcji.',
      'Wybieraj modele z Function Calling / Tools API dla najlepszych agentów.',
    ],
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/best-for"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Wszystkie zastosowania
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center"
        >
          <div className={cn('inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br', info.color)}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              Najlepszy model do: <span className="gradient-text">{info.label.toLowerCase()}</span>
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{info.description}</p>
          </div>
        </motion.div>

        {winner && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            <WinnerCard model={winner} type="overall" info={info} Icon={Icon} />
            {osWinner && osWinner.id !== winner.id && (
              <WinnerCard model={osWinner} type="open-source" info={info} Icon={Icon} />
            )}
            {paidWinner && paidWinner.id !== winner.id && (
              <WinnerCard model={paidWinner} type="paid" info={info} Icon={Icon} />
            )}
          </motion.section>
        )}

        {top.length > 1 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold">Porównanie w {info.label.toLowerCase()}</h2>
            <div className="rounded-2xl border border-border bg-card/30 p-4 backdrop-blur-sm sm:p-6">
              <BarCompare models={top} metric={field as 'quality' | 'speed' | 'coding' | 'math' | 'writing' | 'rating'} height={320} />
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Top {top.length} modeli</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((m, i) => (
              <ModelCard key={m.id} model={m} index={i} />
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-fuchsia-500/5 to-pink-500/5 p-6 sm:p-8"
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Wskazówki ekspertów</h2>
          </div>
          <ul className="space-y-3">
            {tips[useCase].map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  );
}

function WinnerCard({
  model,
  type,
  info,
  Icon,
}: {
  model: (typeof MODELS)[number];
  type: 'overall' | 'open-source' | 'paid';
  info: (typeof USE_CASES_INFO)[UseCase];
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const labels = {
    overall: { title: 'Złoty medal', subtitle: 'Najlepszy ogólnie', color: 'from-yellow-400 to-amber-500' },
    'open-source': { title: 'Open Source', subtitle: 'Najlepszy darmowy', color: 'from-emerald-400 to-green-500' },
    paid: { title: 'API Premium', subtitle: 'Najlepszy płatny', color: 'from-amber-400 to-orange-500' },
  };
  const l = labels[type];
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-glow"
    >
      <div className={cn('absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-20 blur-3xl transition-opacity group-hover:opacity-40', l.color)} />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className={cn('rounded-full bg-gradient-to-r px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white', l.color)}>
            {l.title}
          </span>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-extrabold">{model.name}</h3>
        <p className="text-sm text-muted-foreground">{model.creator} • {l.subtitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{model.description}</p>
        <Link
          href={`/models/${model.id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          Zobacz szczegóły →
        </Link>
      </div>
    </motion.div>
  );
}
