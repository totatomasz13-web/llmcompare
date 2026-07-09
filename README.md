# LLM Compare

> **Profesjonalny portal do porównywania modeli LLM (Large Language Models)**
> Nowoczesna, w pełni responsywna aplikacja webowa zbudowana w Next.js 14, TypeScript i Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![License](https://img.shields.io/badge/License-MIT-green)

## Spis treści

- [O projekcie](#o-projekcie)
- [Funkcje](#funkcje)
- [Stack technologiczny](#stack-technologiczny)
- [Struktura projektu](#struktura-projektu)
- [Instrukcja uruchomienia](#instrukcja-uruchomienia)
- [Dodawanie nowych modeli](#dodawanie-nowych-modeli)
- [Skrypty](#skrypty)
- [Licencja](#licencja)

---

## O projekcie

**LLM Compare** to portal, który pozwala w jednym miejscu porównać najlepsze modele językowe AI — zarówno te **Open Source** (Llama, Qwen, Mistral, DeepSeek, Gemma), jak i płatne **API** (GPT-4o, Claude 3.5, Gemini 1.5). Projekt oferuje:

- **Nowoczesne UI** inspirowane najlepszymi serwisami technologicznymi
- **Pełną responsywność** (telefon, tablet, komputer)
- **Tryb jasny i ciemny** z płynnymi przejściami
- **Animacje i mikrointerakcje** (Framer Motion)
- **Interaktywne wykresy** (Recharts)
- **Zaawansowane filtrowanie i sortowanie** w tabelach
- **Sekcję rekomendacji** "Najlepszy model do..."
- **Wyszukiwarkę** modeli
- **Pełne SEO** (sitemap, robots, JSON-LD, OpenGraph)
- **Dostępność** (ARIA, focus states, skip links)
- **Wydajność** (App Router, optymalizacja, lazy loading)

---

## Funkcje

### Strony

| Strona | Opis |
| --- | --- |
| `/` | Strona główna z hero, statystykami, top modelami i rekomendacjami |
| `/ranking` | Pełny ranking modeli z podium, sortowaniem, widokiem siatki/tabeli |
| `/open-source` | Wszystkie modele open source z wykresami i tabelą |
| `/paid` | Wszystkie modele płatne (API) z wykresami i cenami |
| `/best-for` | Sekcja "Najlepszy model do..." — 10 zastosowań |
| `/best-for/[useCase]` | Szczegółowa rekomendacja dla danego zastosowania |
| `/compare` | Interaktywny komparator do 4 modeli (wykresy radarowe, słupkowe, punktowe, tabela) |
| `/models/[id]` | Strona szczegółów pojedynczego modelu |

### Funkcjonalności szczegółowe

- **Karty modeli** z animowanymi paskami postępu, oceną w gwiazdkach, kolorowymi akcentami gradientowymi
- **Tabele porównawcze** z sortowaniem po dowolnej kolumnie (rosnąco/malejąco)
- **Wyszukiwarka** z filtrami (kategoria, zastosowanie)
- **Widok siatki / tabeli / wykresów** do przełączania
- **Wykresy radarowe** do porównania umiejętności
- **Wykresy słupkowe** dla poszczególnych metryk
- **Wykres punktowy cena vs jakość** z rozmiarem bąbelka = kontekst
- **Sticky header** z blur i dynamicznym tłem
- **Sticky toolbar** z filtrami
- **Animowane wejścia** elementów (fade-up, scale-in, slide-in)
- **Animowane tło** (mesh gradient, grid pattern, blur orbs)
- **Responsywne menu** mobilne z animacją
- **Skip-to-content link** dla czytników ekranowych
- **Tryb systemowy / jasny / ciemny** z pamięcią wyboru
- **Generowanie sitemap.xml** i **robots.txt**
- **Strukturyzowane dane JSON-LD** (Schema.org)
- **PWA manifest** (opcjonalnie do rozbudowy)

---

## Stack technologiczny

- **[Next.js 14](https://nextjs.org)** — React framework z App Router, SSR/SSG
- **[React 18](https://react.dev)** — biblioteka UI
- **[TypeScript](https://www.typescriptlang.org)** — typowanie statyczne
- **[Tailwind CSS 3.4](https://tailwindcss.com)** — utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** — animacje
- **[Recharts](https://recharts.org)** — wykresy (radar, bar, scatter)
- **[Lucide React](https://lucide.dev)** — ikony
- **[next-themes](https://github.com/pacocoursey/next-themes)** — obsługa motywów
- **[clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge)** — utility do łączenia klas

---

## Struktura projektu

```
llm-compare/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Główny layout (metadata, theme provider)
│   ├── page.tsx                  # Strona główna
│   ├── globals.css               # Globalne style + design system
│   ├── not-found.tsx             # Strona 404
│   ├── sitemap.ts                # Generowanie sitemap.xml
│   ├── robots.ts                 # Generowanie robots.txt
│   ├── ranking/page.tsx          # Ranking modeli
│   ├── open-source/page.tsx      # Modele Open Source
│   ├── paid/page.tsx             # Modele płatne
│   ├── best-for/
│   │   ├── page.tsx              # Lista zastosowań
│   │   └── [useCase]/page.tsx    # Szczegóły zastosowania
│   ├── compare/page.tsx          # Komparator modeli
│   └── models/[id]/page.tsx      # Szczegóły modelu
├── components/                   # Komponenty UI
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── model-card.tsx
│   ├── model-table.tsx
│   ├── search-bar.tsx
│   ├── charts.tsx                # Komponenty wykresów
│   ├── category-page.tsx         # Wspólny layout dla open-source / paid
│   └── sections.tsx              # Sekcje strony głównej
├── data/
│   └── models.ts                 # Baza danych modeli (TypeScript)
├── lib/
│   └── utils.ts                  # Funkcje pomocnicze
├── public/
│   ├── icon.svg                  # Favicon / ikona PWA
│   └── manifest.json             # PWA manifest
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── README.md
```

---

## Instrukcja uruchomienia

### Wymagania

- **Node.js 18.17+** (zalecane 20.x)
- **npm**, **yarn**, **pnpm** lub **bun**

### 1. Instalacja zależności

```bash
# z npm
npm install

# lub yarn
yarn install

# lub pnpm
pnpm install

# lub bun
bun install
```

### 2. Uruchomienie w trybie deweloperskim

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem **[http://localhost:3000](http://localhost:3000)**.

### 3. Build produkcyjny

```bash
# Zbuduj aplikację
npm run build

# Uruchom zbudowaną aplikację
npm run start
```

### 4. Sprawdzanie typów i lint

```bash
# TypeScript
npm run typecheck

# ESLint
npm run lint
```

---

## Dodawanie nowych modeli

Aby dodać nowy model, edytuj plik **`data/models.ts`** i dodaj nowy obiekt do tablicy `MODELS`:

```typescript
{
  id: 'nowy-model-1',                       // unikalne ID (URL: /models/nowy-model-1)
  name: 'Nowy Model 1',
  creator: 'Nazwa firmy',
  releaseDate: '2025-02-01',                // format YYYY-MM-DD
  parameters: '13B',                        // opcjonalne - pomiń dla modeli bez podanej liczby parametrów
  contextWindow: 128000,                    // w tokenach
  speed: 8,                                 // 1-10
  quality: 88,                              // 0-100
  reasoning: 86,                            // 0-100
  coding: 85,                               // 0-100
  math: 84,                                 // 0-100
  writing: 86,                              // 0-100
  useCases: ['coding', 'writing', 'math'],  // tablica z dostępnych: coding|writing|math|vision|local|low-end|reasoning|chat|multilingual|research
  hardwareRequirements: '1x RTX 4090 24GB',
  category: 'open-source',                  // 'open-source' | 'paid'
  license: 'Apache 2.0',                    // tylko dla open-source
  // pricePerMillion: { input: 2.5, output: 10 },  // odkomentuj dla płatnych
  // apiProvider: 'OpenAI API',            // tylko dla płatnych
  description: 'Krótki opis modelu (1-2 zdania).',
  strengths: ['Mocna strona 1', 'Mocna strona 2'],
  weaknesses: ['Słaba strona 1'],
  rating: 4.5,                              // 0-5
  popularity: 75,                           // 0-100
  color: 'from-violet-500 to-pink-500',     // gradient Tailwind
  websiteUrl: 'https://example.com',        // opcjonalne
}
```

Nowy model **automatycznie** pojawi się na:
- stronie głównej (top modele)
- stronie `/ranking`
- stronie `/open-source` lub `/paid` (zależnie od kategorii)
- w sekcji "Najlepszy model do..." (jeśli pasuje do wybranych zastosowań)
- w komparatorze `/compare`
- w wyszukiwarce

---

## Skrypty

| Skrypt | Opis |
| --- | --- |
| `npm run dev` | Uruchamia serwer deweloperski (port 3000) |
| `npm run build` | Buduje aplikację produkcyjnie |
| `npm run start` | Uruchamia zbudowaną aplikację |
| `npm run lint` | Sprawdza kod ESLint |
| `npm run typecheck` | Sprawdza typy TypeScript |

---

## Dostępność

Projekt stawia na dostępność:

- Prawidłowa hierarchia nagłówków (`h1`–`h6`)
- Etykiety `aria-label` dla przycisków ikonowych
- `aria-current` dla aktywnych linków nawigacji
- **Skip link** "Przejdź do treści" widoczny przy fokusie klawiatury
- Wystarczający kontrast kolorów (WCAG AA)
- Focus rings widoczne na wszystkich interaktywnych elementach
- Semantyczny HTML (`<main>`, `<nav>`, `<article>`, `<header>`, `<footer>`)

---

## SEO

- Metadata dla każdej strony (title, description, OpenGraph, Twitter)
- **JSON-LD** structured data (Schema.org)
- Automatyczny **sitemap.xml** (`/sitemap.xml`)
- **robots.txt** (`/robots.txt`)
- Optymalizacja obrazów przez Next.js Image (gdy dodasz własne)
- Canonical URLs

---

## Wydajność

- **Next.js App Router** z komponentami serwerowymi (RSC) gdzie to możliwe
- **Tree-shaking** i code splitting
- **Optymalizacja importów** dla lucide-react, recharts, framer-motion
- **Tailwind CSS** z purge niepotrzebnych klas
- **System font** (Inter z fallbackiem) — brak blokującego ładowania
- Responsywne obrazy (Next/Image)
- Kompresja gzip/brotli (wbudowana w Next.js)
- Statyczne generowanie stron (`generateStaticParams`)

---

## Licencja

Projekt dostępny na licencji **MIT**. Możesz go swobodnie używać, modyfikować i dystrybuować.

---

## Podziękowania

Dane modeli oparte na publicznie dostępnych benchmarkach i materiałach producentów:
- OpenAI, Anthropic, Google DeepMind, Meta, Mistral AI, Alibaba, DeepSeek, Microsoft, 01.AI, Cohere

---

**Stworzone z dbałością o każdy detal** — gotowe do publikacji.
