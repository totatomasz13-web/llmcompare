import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { dbGetUserActivity } from '@/lib/db';
import { MODELS } from '@/data/models';
import { HistoryClient } from './history-client';

export const metadata = { title: 'Historia aktywności' };

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/profile/history');

  const items = await dbGetUserActivity(user.id, 200);

  return <HistoryClient items={items} modelMap={Object.fromEntries(MODELS.map((m) => [m.id, m]))} />;
}
