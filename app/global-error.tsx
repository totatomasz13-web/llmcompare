'use client';

import * as React from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pl">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
          <div className="rounded-2xl bg-rose-500/10 p-4">
            <svg className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Coś poszło nie tak</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Spróbuj ponownie
          </button>
        </div>
      </body>
    </html>
  );
}
