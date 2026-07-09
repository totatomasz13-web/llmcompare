import Link from 'next/link';
import { Brain, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="text-center">
        <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
          <Brain className="h-10 w-10 text-white" />
        </div>
        <h1 className="mt-6 text-6xl font-extrabold tracking-tight sm:text-7xl">
          <span className="gradient-text">404</span>
        </h1>
        <p className="mt-3 text-2xl font-bold">Strona nie istnieje</p>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Model lub strona, której szukasz, nie została znaleziona. Może model został usunięty lub podano zły adres.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
          >
            <Home className="h-4 w-4" />
            Strona główna
          </Link>
          <Link
            href="/ranking"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all hover:border-primary/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Zobacz ranking
          </Link>
        </div>
      </div>
    </div>
  );
}
