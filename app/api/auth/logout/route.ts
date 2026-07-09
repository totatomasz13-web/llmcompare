import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { destroySession, clearSessionCookie, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(_req: NextRequest) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await destroySession(token);
  }
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
