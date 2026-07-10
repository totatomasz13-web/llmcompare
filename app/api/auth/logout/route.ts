import { NextRequest, NextResponse } from 'next/server';
import { destroySession, clearCookieOnResponse } from '@/lib/auth';

export async function POST(_req: NextRequest) {
  try {
    await destroySession('');
    const res = NextResponse.json({ ok: true });
    clearCookieOnResponse(res);
    return res;
  } catch (err: any) {
    console.error('Logout error:', err);
    return NextResponse.json(
      { error: `Błąd serwera: ${err?.message || 'nieznany błąd'}` },
      { status: 500 }
    );
  }
}
