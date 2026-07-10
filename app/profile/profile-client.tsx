'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  User as UserIcon, Heart, MessageSquare, History, LayoutDashboard,
  Settings, Mail, Calendar, AtSign, Sparkles, ChevronRight, Crown,
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

interface ProfileClientProps {
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    role: string;
    bio?: string;
    avatarUrl?: string;
    createdAt?: string;
  };
  stats: { favorites: number; reviews: number; comparisons: number; views: number };
}

export function ProfileClient({ user, stats }: ProfileClientProps) {
  const { logout } = useAuth();
  const initials = user.displayName.slice(0, 2).toUpperCase();
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long' }) : '';

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm sm:p-8"
        >
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="" width={80} height={80} className="h-20 w-20 rounded-2xl object-cover" unoptimized />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-2xl font-extrabold text-white shadow-glow">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{user.displayName}</h1>
                {user.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600">
                    <Crown className="h-3 w-3" /> Admin
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><AtSign className="h-3.5 w-3.5" /> {user.username}</span>
                <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
                {memberSince && (
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Członek od {memberSince}</span>
                )}
              </div>
              {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBox label="Ulubione" value={stats.favorites} icon={Heart} href="/profile/favorites" />
            <StatBox label="Recenzje" value={stats.reviews} icon={MessageSquare} href="/profile/reviews" />
            <StatBox label="Porównania" value={stats.comparisons} icon={LayoutDashboard} href="/profile/saved" />
            <StatBox label="Wyświetlenia" value={stats.views} icon={History} href="/profile/history" />
          </div>
        </motion.div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <NavCard href="/profile/favorites" icon={Heart} title="Ulubione modele" desc="Twoje zapisane modele LLM" color="from-rose-500 to-pink-500" />
          <NavCard href="/profile/reviews" icon={MessageSquare} title="Moje recenzje" desc="Twoje opinie i oceny" color="from-blue-500 to-cyan-500" />
          <NavCard href="/profile/saved" icon={LayoutDashboard} title="Zapisane porównania" desc="Twoje zestawienia modeli" color="from-violet-500 to-fuchsia-500" />
          <NavCard href="/profile/history" icon={History} title="Historia aktywności" desc="Ostatnio oglądane modele" color="from-amber-500 to-orange-500" />
          <NavCard href="/profile/settings" icon={Settings} title="Ustawienia" desc="Profil, hasło, preferencje" color="from-slate-500 to-gray-600" />
          <button
            type="button"
            onClick={() => logout()}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5 text-left transition-all hover:border-rose-500/60 hover:bg-rose-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-rose-500">Wyloguj się</div>
                <div className="text-xs text-muted-foreground">Zakończ sesję</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-rose-500 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, href }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; href: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-background/40 p-4 transition-all hover:border-primary/40 hover:bg-card/60"
    >
      <Icon className="mb-1 h-4 w-4 text-muted-foreground" />
      <div className="text-2xl font-extrabold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </Link>
  );
}

function NavCard({ href, icon: Icon, title, desc, color }: { href: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string; color: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/40 p-5 transition-all hover:border-primary/40 hover:bg-card/60"
    >
      <div className="flex items-center gap-3">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br', color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <div className="font-bold">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}
