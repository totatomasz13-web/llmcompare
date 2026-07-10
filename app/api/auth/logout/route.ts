import { NextRequest, NextResponse } from 'next/server';
import { destroySession, clearCookieOnResponse, COOKIE_NAME } from '@/lib/auth';

export async function POST(_req: NextRequest) {
  await destroySession('');
  const res = NextResponse.json({ ok: true });
  clearCookieOnResponse(res);
  return res;
}
