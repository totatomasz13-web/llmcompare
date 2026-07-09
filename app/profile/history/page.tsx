import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDB } from '@/lib/db';
import { MODELS } from '@/data/models';
import { HistoryClient } from './history-client';

export const metadata = { title: 'Historia aktywności' };

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?redirect=/profile/history');

  const db = await getDB();
  const items = db.activity
    .filter((a) => a.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 200);

  return <HistoryClient items={items} modelMap={Object.fromEntries(MODELS.map((m) => [m.id, m]))} />;
}
