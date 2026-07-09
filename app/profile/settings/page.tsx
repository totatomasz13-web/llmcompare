import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { SettingsClient } from './settings-client';

export const metadata = { title: 'Ustawienia' };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/profile/settings');

  return (
    <SettingsClient
      user={{
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName || user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        preferences: user.preferences,
      }}
    />
  );
}
