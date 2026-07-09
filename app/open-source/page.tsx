import type { Metadata } from 'next';
import { CategoryPage } from '@/components/category-page';

export const metadata: Metadata = {
  title: 'Modele Open Source',
  description:
    'Przeglądaj i porównuj najlepsze otwartoźródłowe modele LLM: Llama, Qwen, Mistral, DeepSeek, Gemma i inne.',
};

export default function OpenSourcePage() {
  return (
    <CategoryPage
      category="open-source"
      title={
        <>
          Modele <span className="gradient-text-cool">Open Source</span>
        </>
      }
      subtitle="Swobodnie uruchamiaj, modyfikuj i wdrażaj najlepsze otwarte modele LLM. Licencja permissive, pełna kontrola nad danymi."
      accent="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      icon="open"
    />
  );
}
