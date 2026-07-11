'use client';

import { useEffect } from 'react';

function hasSessionCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').some((c) => c.startsWith('llm_session='));
}

export function ViewTracker({ modelId }: { modelId: string }) {
  useEffect(() => {
    if (!hasSessionCookie()) return;
    fetch('/api/activity/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId }),
    }).catch(() => {});
  }, [modelId]);
  return null;
}
