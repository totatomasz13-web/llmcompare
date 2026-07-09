'use client';

import * as React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import type { LLMModel } from '@/data/models';
import { formatContext } from '@/data/models';
import { cn } from '@/lib/utils';

interface RadarCompareProps {
  models: LLMModel[];
  height?: number;
}

export function RadarCompare({ models, height = 380 }: RadarCompareProps) {
  const data = React.useMemo(() => {
    const metrics = [
      { key: 'quality', label: 'Jakość' },
      { key: 'speed', label: 'Szybkość' },
      { key: 'coding', label: 'Programowanie' },
      { key: 'math', label: 'Matematyka' },
      { key: 'writing', label: 'Pisanie' },
      { key: 'reasoning', label: 'Rozumowanie' },
    ];
    return metrics.map((m) => {
      const point: Record<string, number | string> = { metric: m.label };
      models.forEach((model) => {
        point[model.name] = model[m.key as keyof LLMModel] as number;
      });
      return point;
    });
  }, [models]);

  const colorPalette = ['#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6'];

  if (models.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        Wybierz modele aby porównać
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
        />
        {models.map((model, i) => (
          <Radar
            key={model.id}
            name={model.name}
            dataKey={model.name}
            stroke={colorPalette[i % colorPalette.length]}
            fill={colorPalette[i % colorPalette.length]}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        ))}
        <Legend
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          iconType="circle"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            fontSize: '12px',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

interface BarCompareProps {
  models: LLMModel[];
  metric: 'quality' | 'speed' | 'coding' | 'math' | 'writing' | 'rating';
  height?: number;
}

export function BarCompare({ models, metric, height = 320 }: BarCompareProps) {
  const data = models.map((m) => ({
    name: m.name.length > 14 ? m.name.slice(0, 14) + '…' : m.name,
    value: m[metric] as number,
    full: m,
  }));

  const labelMap: Record<BarCompareProps['metric'], string> = {
    quality: 'Jakość',
    speed: 'Szybkość',
    coding: 'Programowanie',
    math: 'Matematyka',
    writing: 'Pisanie',
    rating: 'Ocena',
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          angle={-30}
          textAnchor="end"
          height={70}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          domain={[0, metric === 'speed' ? 10 : 100]}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            fontSize: '12px',
          }}
        />
        <Bar
          dataKey="value"
          name={labelMap[metric]}
          fill="url(#barGradient)"
          radius={[8, 8, 0, 0]}
        />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface PriceVsQualityProps {
  models: LLMModel[];
  height?: number;
}

export function PriceVsQuality({ models, height = 400 }: PriceVsQualityProps) {
  const data = React.useMemo(() => {
    return models.map((m) => {
      const inputPrice = m.pricePerMillion?.input ?? 0;
      const outputPrice = m.pricePerMillion?.output ?? 0;
      const isOpen = m.category === 'open-source';
      return {
        name: m.name,
        creator: m.creator,
        quality: m.quality,
        price: isOpen ? 0 : inputPrice + outputPrice,
        inputPrice,
        outputPrice,
        context: m.contextWindow,
        category: m.category,
        isOpen,
      };
    });
  }, [models]);

  const paidPrices = data.filter((d) => !d.isOpen).map((d) => d.price);
  const minPrice = paidPrices.length ? Math.max(0.01, Math.min(...paidPrices) * 0.8) : 0.1;
  const maxPrice = paidPrices.length ? Math.max(...paidPrices) * 1.2 : 100;
  const minQuality = data.length ? Math.max(0, Math.min(...data.map((d) => d.quality)) - 5) : 60;
  const maxQuality = data.length ? Math.min(100, Math.max(...data.map((d) => d.quality)) + 2) : 100;
  const maxContext = data.length ? Math.max(...data.map((d) => d.context), 1) : 1;

  const openSource = data.filter((d) => d.isOpen);
  const paid = data.filter((d) => !d.isOpen);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Open Source ({openSource.length}) — lewa kolumna
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          API/Płatne ({paid.length})
        </span>
        <span className="text-[10px]">Rozmiar = kontekst</span>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="price"
            name="Cena"
            scale="log"
            domain={[minPrice, maxPrice]}
            allowDataOverflow
            tickFormatter={(v) => (v < 1 ? `$${v.toFixed(2)}` : `$${v.toFixed(0)}`)}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            label={{
              value: 'Cena (suma input + output / 1M tok., skala log)',
              position: 'insideBottom',
              offset: -10,
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            dataKey="quality"
            name="Jakość"
            domain={[minQuality, maxQuality]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            label={{
              value: 'Jakość (0–100)',
              angle: -90,
              position: 'insideLeft',
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 11,
            }}
          />
          <ZAxis
            type="number"
            dataKey="context"
            range={[80, 600]}
            name="Kontekst"
            domain={[0, maxContext]}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const d = payload[0].payload as (typeof data)[number];
              return (
                <div className="rounded-xl border border-border bg-card/95 p-3 text-xs shadow-soft backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        d.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
                      )}
                    />
                    <div className="font-bold">{d.name}</div>
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{d.creator}</div>
                  <div className="mt-1.5 space-y-0.5 text-muted-foreground">
                    <div>
                      Jakość: <span className="font-semibold text-foreground">{d.quality}/100</span>
                    </div>
                    <div>
                      {d.isOpen ? (
                        <>
                          Cena:{' '}
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            Open Source (darmowe)
                          </span>
                        </>
                      ) : (
                        <>
                          Cena:{' '}
                          <span className="font-semibold text-foreground">
                            ${d.inputPrice.toFixed(2)} in / ${d.outputPrice.toFixed(2)} out
                          </span>
                        </>
                      )}
                    </div>
                    <div>
                      Kontekst:{' '}
                      <span className="font-semibold text-foreground">
                        {formatContext(d.context)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          {openSource.length > 0 && (
            <Scatter
              name="Open Source"
              data={openSource.map((d) => ({ ...d, price: minPrice * 0.5 }))}
              fill="#10b981"
              shape="circle"
            />
          )}
          {paid.length > 0 && (
            <Scatter
              name="API (płatne)"
              data={paid}
              fill="#f59e0b"
              shape="circle"
            />
          )}
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
