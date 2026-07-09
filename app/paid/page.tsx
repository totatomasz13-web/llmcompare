import type { Metadata } from 'next';
import { CategoryPage } from '@/components/category-page';

export const metadata: Metadata = {
  title: 'Modele API (płatne)',
  description:
    'Przeglądaj i porównuj najlepsze płatne modele LLM: GPT-4o, Claude 3.5, Gemini 1.5 i inne. Aktualne ceny API.',
};

export default function PaidPage() {
  return (
    <CategoryPage
      category="paid"
      title={
        <>
          Modele <span className="gradient-text">API / Płatne</span>
        </>
      }
      subtitle="Najwyższa jakość bez konfigurowania infrastruktury. Porównaj ceny, limity kontekstu i możliwości najlepszych modeli na rynku."
      accent="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
      icon="paid"
    />
  );
}
