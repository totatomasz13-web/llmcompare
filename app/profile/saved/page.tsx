import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { MODELS } from '@/data/models';
import { SavedComparisonsClient } from './saved-client';

export const metadata = { title: 'Zapisane porównania' };

export default async function SavedComparisonsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/profile/saved');

  const db = await getDB();
  const items = db.comparisons
    .filter((c) => c.userId === user.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const enriched = items.map((c) => ({
    ...c,
    models: c.modelIds.map((id) => MODELS.find((m) => m.id === id)).filter(Boolean) as any[],
  }));

  return <SavedComparisonsClient items={enriched} />;
}
