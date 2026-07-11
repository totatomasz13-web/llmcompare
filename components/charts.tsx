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
} from 'recharts';
import type { LLMModel } from '@/data/models';

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
  const data = models.map((m) => {
    const raw = m[metric] as number;
    return {
      name: m.name.length > 14 ? m.name.slice(0, 14) + '…' : m.name,
      value: raw,
      raw,
      full: m,
    };
  });

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
          domain={[0, 100]}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            fontSize: '12px',
          }}
          formatter={(value: number, _name: string, props: any) => {
            const raw = props?.payload?.raw ?? value;
            return [`${raw}/100`, labelMap[metric]];
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
