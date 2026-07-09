'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Loader2, LogIn, Plus, X, Check, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { RatingStars } from '@/components/rating-stars';
import { cn } from '@/lib/utils';

export function ReviewForm({ modelId }: { modelId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [pros, setPros] = React.useState<string[]>([]);
  const [cons, setCons] = React.useState<string[]>([]);
  const [proInput, setProInput] = React.useState('');
  const [conInput, setConInput] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?modelId=${encodeURIComponent(modelId)}`);
      const data = await res.json();
      setReviews(data.items || []);
    } finally {
      setLoading(false);
    }
  }, [modelId]);

  React.useEffect(() => { load(); }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId, rating, title, content, pros, cons }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Błąd');
        return;
      }
      setShowForm(false);
      setTitle(''); setContent(''); setPros([]); setCons([]); setRating(5);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length
    : 0;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
            <MessageSquare className="h-3 w-3" /> Recenzje
          </div>
          <h2 className="text-xl font-bold">Recenzje użytkowników</h2>
          {reviews.length > 0 && (
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <RatingStars value={avgRating} readonly size="sm" />
              <span>{reviews.length} {reviews.length === 1 ? 'recenzja' : 'recenzji'} · śr. {avgRating.toFixed(1)}/5</span>
            </div>
          )}
        </div>
        {user ? (
          !showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> Dodaj recenzję
            </button>
          )
        ) : (
          <a
            href={`/login?redirect=/models/${modelId}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-semibold"
          >
            <LogIn className="h-4 w-4" /> Zaloguj, by dodać recenzję
          </a>
        )}
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={submit}
          className="mb-6 overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold">Twoja recenzja</h3>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Anuluj" className="rounded p-1 text-muted-foreground hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mb-3">
            <label className="mb-1.5 block text-sm font-medium">Ocena</label>
            <RatingStars value={rating} onChange={setRating} size="lg" />
          </div>
          <div className="mb-3">
            <label className="mb-1.5 block text-sm font-medium">Tytuł (opcjonalnie)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="mb-3">
            <label className="mb-1.5 block text-sm font-medium">Treść *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required minLength={10} maxLength={2000} rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TagInput label="Plusy" items={pros} input={proInput} setInput={setProInput} onAdd={() => { if (proInput.trim()) { setPros([...pros, proInput.trim()]); setProInput(''); } }} onRemove={(i) => setPros(pros.filter((_, j) => j !== i))} color="emerald" />
            <TagInput label="Minusy" items={cons} input={conInput} setInput={setConInput} onAdd={() => { if (conInput.trim()) { setCons([...cons, conInput.trim()]); setConInput(''); } }} onRemove={(i) => setCons(cons.filter((_, j) => j !== i))} color="rose" />
          </div>
          {error && (
            <div className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-500">{error}</div>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-medium">Anuluj</button>
            <button type="submit" disabled={submitting || content.length < 10}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Opublikuj
            </button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 text-sm text-muted-foreground">
          Brak recenzji — bądź pierwszy!
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <ReviewItem key={r.id} review={r} onHelpful={async () => {
              await fetch(`/api/reviews/${r.id}/helpful`, { method: 'POST' });
              setReviews((arr) => arr.map((x) => x.id === r.id ? { ...x, helpful: x.helpful + 1 } : x));
            }} />
          ))}
        </div>
      )}
    </section>
  );
}

function TagInput({ label, items, input, setInput, onAdd, onRemove, color }: { label: string; items: string[]; input: string; setInput: (s: string) => void; onAdd: () => void; onRemove: (i: number) => void; color: 'emerald' | 'rose' }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd(); } }}
          maxLength={100}
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <button type="button" onClick={onAdd} className="rounded-lg bg-muted px-3 text-sm font-medium hover:bg-muted/70">+</button>
      </div>
      {items.length > 0 && (
        <ul className="mt-2 space-y-1">
          {items.map((it, i) => (
            <li key={i} className={cn('flex items-center gap-2 rounded-md px-2 py-1 text-xs', color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400')}>
              <span className="flex-1">{it}</span>
              <button type="button" onClick={() => onRemove(i)} aria-label="Usuń" className="opacity-60 hover:opacity-100"><X className="h-3 w-3" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReviewItem({ review, onHelpful }: { review: any; onHelpful: () => void }) {
  return (
    <article className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
              {(review.author?.displayName || '?').slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold">{review.author?.displayName || 'Anonim'}</div>
              <div className="text-[10px] text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
        <RatingStars value={review.rating} readonly size="sm" />
      </div>
      {review.title && <h4 className="mt-1 font-bold">{review.title}</h4>}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.content}</p>
      {(review.pros?.length || review.cons?.length) ? (
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          {review.pros?.length > 0 && (
            <div>
              <div className="mb-1 font-semibold text-emerald-500">Plusy</div>
              <ul className="space-y-0.5 text-muted-foreground">
                {review.pros.map((p: string, j: number) => <li key={j}>+ {p}</li>)}
              </ul>
            </div>
          )}
          {review.cons?.length > 0 && (
            <div>
              <div className="mb-1 font-semibold text-rose-500">Minusy</div>
              <ul className="space-y-0.5 text-muted-foreground">
                {review.cons.map((p: string, j: number) => <li key={j}>- {p}</li>)}
              </ul>
            </div>
          )}
        </div>
      ) : null}
      <div className="mt-3 flex items-center gap-2">
        <button type="button" onClick={onHelpful} className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground hover:bg-muted">
          <ThumbsUp className="h-3 w-3" /> Pomocne ({review.helpful})
        </button>
      </div>
    </article>
  );
}
