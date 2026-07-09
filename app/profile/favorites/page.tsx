import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { FavoritesClient } from './favorites-client';
import { MODELS } from '@/data/models';

export const metadata = { title: 'Ulubione modele' };

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/profile/favorites');

  const db = await getDB();
  const favs = db.favorites
    .filter((f) => f.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const models = favs
    .map((f) => {
      const m = MODELS.find((m) => m.id === f.modelId);
      return m ? { ...m, favoritedAt: f.createdAt, note: f.note } : null;
    })
    .filter(Boolean) as Array<typeof MODELS[number] & { favoritedAt: string; note?: string }>;

  return <FavoritesClient favorites={models} />;
}
