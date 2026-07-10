import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { destroySession, clearSessionCookie, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(_req: NextRequest) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await destroySession(token);
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
