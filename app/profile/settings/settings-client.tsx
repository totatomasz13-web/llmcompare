'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, User, Lock, Save, Loader2, Check, Eye, EyeOff, Trash2, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';

export function SettingsClient({ user }: { user: any }) {
  const { updateProfile, changePassword, logout } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = React.useState(user.displayName);
  const [bio, setBio] = React.useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = React.useState(user.avatarUrl || '');
  const [defaultView, setDefaultView] = React.useState(user.preferences?.defaultView || 'grid');
  const [emailNotif, setEmailNotif] = React.useState(user.preferences?.emailNotifications || false);

  const [savingProfile, setSavingProfile] = React.useState(false);
  const [profileMsg, setProfileMsg] = React.useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [curPwd, setCurPwd] = React.useState('');
  const [newPwd, setNewPwd] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [savingPwd, setSavingPwd] = React.useState(false);
  const [pwdMsg, setPwdMsg] = React.useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [confirmDelete, setConfirmDelete] = React.useState('');

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    const res = await updateProfile({
      displayName,
      bio,
      avatarUrl: avatarUrl || undefined,
      preferences: { defaultView, emailNotifications: emailNotif },
    });
    setSavingProfile(false);
    setProfileMsg(res.ok ? { type: 'ok', text: 'Zapisano!' } : { type: 'err', text: res.error || 'Błąd' });
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPwd(true);
    setPwdMsg(null);
    const res = await changePassword(curPwd, newPwd);
    setSavingPwd(false);
    if (res.ok) {
      setCurPwd(''); setNewPwd('');
      setPwdMsg({ type: 'ok', text: 'Hasło zmienione!' });
    } else {
      setPwdMsg({ type: 'err', text: res.error || 'Błąd' });
    }
  };

  const deleteAccount = async () => {
    if (confirmDelete !== user.username) return;
    await fetch('/api/auth/account', { method: 'DELETE' });
    await logout();
    router.push('/');
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh-1 opacity-30" />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Profil
        </Link>
        <h1 className="mt-4 mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl">Ustawienia</h1>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Profil</h2>
          </div>
          <form onSubmit={saveProfile} className="space-y-4">
            <Field label="Nazwa wyświetlana">
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </Field>
            <Field label="Avatar URL">
              <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} type="url" placeholder="https://..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </Field>
            <Field label="Bio (max 500 znaków)">
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </Field>
            <Field label="Domyślny widok rankingu">
              <div className="flex gap-2">
                {(['grid', 'table'] as const).map((v) => (
                  <button key={v} type="button" onClick={() => setDefaultView(v)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${defaultView === v ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {v === 'grid' ? 'Siatka' : 'Tabela'}
                  </button>
                ))}
              </div>
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)}
                className="h-4 w-4 rounded border-input" />
              <span>Powiadomienia email o nowych modelach</span>
            </label>
            {profileMsg && (
              <div className={`rounded-lg border px-3 py-2 text-sm ${profileMsg.type === 'ok' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'border-rose-500/30 bg-rose-500/10 text-rose-500'}`}>
                {profileMsg.text}
              </div>
            )}
            <button type="submit" disabled={savingProfile}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60">
              {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Zapisz profil
            </button>
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Zmień hasło</h2>
          </div>
          <form onSubmit={savePassword} className="space-y-4">
            <Field label="Obecne hasło">
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={curPwd} onChange={(e) => setCurPwd(e.target.value)} required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Field label="Nowe hasło (min 8 znaków, A-z, 0-9)">
              <input type={showPwd ? 'text' : 'password'} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required minLength={8}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </Field>
            {pwdMsg && (
              <div className={`rounded-lg border px-3 py-2 text-sm ${pwdMsg.type === 'ok' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'border-rose-500/30 bg-rose-500/10 text-rose-500'}`}>
                {pwdMsg.text}
              </div>
            )}
            <button type="submit" disabled={savingPwd}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60">
              {savingPwd ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Zmień hasło
            </button>
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-bold text-rose-500">Strefa niebezpieczna</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane (ulubione, recenzje, porównania) zostaną trwale usunięte.
          </p>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Aby potwierdzić, wpisz swoją nazwę użytkownika: <span className="font-mono text-foreground">{user.username}</span>
          </p>
          <div className="flex gap-2">
            <input value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder={user.username}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button type="button" disabled={confirmDelete !== user.username} onClick={deleteAccount}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-rose-600 disabled:opacity-50">
              <Trash2 className="h-4 w-4" /> Usuń konto
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
