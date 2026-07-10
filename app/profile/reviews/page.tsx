import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { dbGetReviews } from '@/lib/db';
import { MODELS } from '@/data/models';
import { ReviewsClient } from './reviews-client';

export const metadata = { title: 'Moje recenzje' };

export default async function MyReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/profile/reviews');

  const items = await dbGetReviews(undefined, user.id);

  const enriched = items.map((r: any) => {
    const m = MODELS.find((m) => m.id === r.modelId);
    return { ...r, model: m ? { id: m.id, name: m.name, creator: m.creator, color: m.color } : null };
  });

  return <ReviewsClient items={enriched} />;
}
