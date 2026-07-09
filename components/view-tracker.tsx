'use client';

import { useEffect } from 'react';

export function ViewTracker({ modelId }: { modelId: string }) {
  useEffect(() => {
    fetch('/api/activity/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId }),
    }).catch(() => {});
  }, [modelId]);
  return null;
}
