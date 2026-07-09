import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { MODELS } from '@/data/models';
import { ReviewsClient } from './reviews-client';

export const metadata = { title: 'Moje recenzje' };

export default async function MyReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/profile/reviews');

  const db = await getDB();
  const items = db.reviews
    .filter((r) => r.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((r) => {
      const m = MODELS.find((m) => m.id === r.modelId);
      return { ...r, model: m ? { id: m.id, name: m.name, creator: m.creator, color: m.color } : null };
    });

  return <ReviewsClient items={items} />;
}
