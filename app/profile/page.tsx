import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { ProfileClient } from './profile-client';

export const metadata = { title: 'Mój profil' };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/profile');

  const db = await getDB();
  const favCount = db.favorites.filter((f) => f.userId === user.id).length;
  const reviewCount = db.reviews.filter((r) => r.userId === user.id).length;
  const compCount = db.comparisons.filter((c) => c.userId === user.id).length;
  const viewCount = db.activity.filter((a) => a.userId === user.id && a.type === 'view').length;

  return (
    <ProfileClient
      user={{
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName || user.username,
        role: user.role,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      }}
      stats={{ favorites: favCount, reviews: reviewCount, comparisons: compCount, views: viewCount }}
    />
  );
}
