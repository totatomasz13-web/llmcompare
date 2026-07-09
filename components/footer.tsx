import Link from 'next/link';
import { Brain, Github, Twitter, Mail, Heart } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Przeglądaj',
    links: [
      { href: '/ranking', label: 'Ranking modeli' },
      { href: '/open-source', label: 'Open Source' },
      { href: '/paid', label: 'Modele API' },
      { href: '/best-for', label: 'Najlepszy do...' },
      { href: '/compare', label: 'Porównaj' },
    ],
  },
  {
    title: 'Zastosowania',
    links: [
      { href: '/best-for/coding', label: 'Programowanie' },
      { href: '/best-for/writing', label: 'Pisanie tekstów' },
      { href: '/best-for/math', label: 'Matematyka' },
      { href: '/best-for/local', label: 'Działanie lokalne' },
      { href: '/best-for/low-end', label: 'Słaby sprzęt' },
    ],
  },
  {
    title: 'Projekt',
    links: [
      { href: '/', label: 'O projekcie' },
      { href: 'https://github.com', label: 'GitHub' },
      { href: '/', label: 'Dokumentacja' },
      { href: '/', label: 'API' },
      { href: '/', label: 'Kontakt' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border/60 bg-card/30 backdrop-blur-sm">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_3fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">LLM Compare</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Profesjonalny portal do porównywania modeli językowych AI. Pomagamy wybrać
              najlepszy model do Twoich zastosowań — czy to open source, czy API.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Twitter / X"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:contact@llm-compare.dev"
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold">{group.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} LLM Compare. Wszystkie znaki towarowe należą do ich właścicieli.
          </p>
          <p className="flex items-center gap-1.5">
            Stworzone z <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> dla społeczności AI
          </p>
        </div>
      </div>
    </footer>
  );
}
