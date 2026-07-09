'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingStars({ value, onChange, readonly, size = 'md', className }: RatingStarsProps) {
  const sizes = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-7 w-7' };
  return (
    <div className={cn('inline-flex items-center gap-0.5', className)} role="radiogroup" aria-label="Ocena">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        return (
          <button
            key={n}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(n)}
            aria-label={`${n} ${n === 1 ? 'gwiazdka' : 'gwiazdki'}`}
            aria-checked={n === Math.round(value)}
            role="radio"
            className={cn(
              'transition-transform',
              !readonly && 'hover:scale-110 cursor-pointer',
              readonly && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                filled ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground/40'
              )}
            />
          </button>
        );
      })}
      {!readonly && value > 0 && (
        <span className="ml-1.5 text-xs text-muted-foreground">{value}/5</span>
      )}
    </div>
  );
}
