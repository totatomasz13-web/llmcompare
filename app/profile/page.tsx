import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { dbGetUserFavorites, dbGetUserComparisons, dbGetUserActivity } from '@/lib/db';
import { ProfileClient } from './profile-client';

export const metadata = { title: 'Mój profil' };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/profile');

  const [favs, comparisons, activity] = await Promise.all([
    dbGetUserFavorites(user.id),
    dbGetUserComparisons(user.id),
    dbGetUserActivity(user.id, 10000),
  ]);

  const favCount = favs.length;
  const compCount = comparisons.length;
  const viewCount = activity.filter((a) => a.type === 'view').length;

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
      stats={{ favorites: favCount, reviews: 0, comparisons: compCount, views: viewCount }}
    />
  );
}
