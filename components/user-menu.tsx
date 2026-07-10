'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, LogOut, Settings, Heart, MessageSquare, History, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

export function UserMenu() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (loading) {
    return <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Zaloguj
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1.5 text-sm font-semibold text-white shadow-soft transition-all hover:shadow-glow"
        >
          Załóż konto
        </Link>
      </div>
    );
  }

  const initials = (user.displayName || user.username).slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu użytkownika"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-2 py-1.5 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card"
      >
        {user.avatarUrl ? (
          <Image src={user.avatarUrl} alt="" width={28} height={28} className="h-7 w-7 rounded-lg object-cover" unoptimized />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
            {initials}
          </div>
        )}
        <span className="hidden text-sm font-medium sm:inline">{user.displayName}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="border-b border-border bg-muted/30 p-3">
              <div className="text-sm font-bold">{user.displayName}</div>
              <div className="text-xs text-muted-foreground">@{user.username}</div>
              {user.role === 'admin' && (
                <span className="mt-1 inline-flex rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                  ADMIN
                </span>
              )}
            </div>
            <div className="p-1">
              <MenuItem href="/profile" icon={UserIcon} label="Mój profil" onClick={() => setOpen(false)} />
              <MenuItem href="/profile/favorites" icon={Heart} label="Ulubione" onClick={() => setOpen(false)} />
              <MenuItem href="/profile/reviews" icon={MessageSquare} label="Moje recenzje" onClick={() => setOpen(false)} />
              <MenuItem href="/profile/history" icon={History} label="Historia" onClick={() => setOpen(false)} />
              <MenuItem href="/profile/saved" icon={LayoutDashboard} label="Zapisane porównania" onClick={() => setOpen(false)} />
              <MenuItem href="/profile/settings" icon={Settings} label="Ustawienia" onClick={() => setOpen(false)} />
            </div>
            <div className="border-t border-border p-1">
              <button
                type="button"
                onClick={() => { logout(); setOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-500 transition-colors hover:bg-rose-500/10"
              >
                <LogOut className="h-4 w-4" />
                Wyloguj się
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  href, icon: Icon, label, onClick,
}: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
