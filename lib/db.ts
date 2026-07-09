import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data', 'userdata');

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerified: boolean;
  preferences: {
    defaultView: 'grid' | 'table';
    emailNotifications: boolean;
  };
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  modelId: string;
  createdAt: string;
  note?: string;
}

export interface Review {
  id: string;
  userId: string;
  modelId: string;
  rating: number;
  title?: string;
  content: string;
  pros: string[];
  cons: string[];
  createdAt: string;
  updatedAt: string;
  helpful: number;
  reported: boolean;
}

export interface SavedComparison {
  id: string;
  userId: string;
  name: string;
  modelIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'view' | 'favorite' | 'review' | 'compare' | 'login' | 'register';
  modelId?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

interface DBShape {
  users: User[];
  sessions: Session[];
  favorites: Favorite[];
  reviews: Review[];
  comparisons: SavedComparison[];
  activity: Activity[];
  resetTokens: PasswordResetToken[];
}

const EMPTY_DB: DBShape = {
  users: [],
  sessions: [],
  favorites: [],
  reviews: [],
  comparisons: [],
  activity: [],
  resetTokens: [],
};

let cache: DBShape | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    /* exists */
  }
}

async function readFromDisk(): Promise<DBShape> {
  await ensureDir();
  const file = path.join(DATA_DIR, 'db.json');
  try {
    const raw = await fs.readFile(file, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DBShape>;
    return { ...EMPTY_DB, ...parsed };
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      await writeToDisk(EMPTY_DB);
      return EMPTY_DB;
    }
    throw err;
  }
}

async function writeToDisk(db: DBShape) {
  await ensureDir();
  const file = path.join(DATA_DIR, 'db.json');
  const tmp = file + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), 'utf-8');
  await fs.rename(tmp, file);
}

export async function getDB(): Promise<DBShape> {
  if (cache) return cache;
  cache = await readFromDisk();
  return cache;
}

export async function saveDB(db: DBShape): Promise<void> {
  cache = db;
  writeQueue = writeQueue.then(() => writeToDisk(db));
  await writeQueue;
}

export async function mutate<T>(fn: (db: DBShape) => T | Promise<T>): Promise<T> {
  const db = await getDB();
  const result = await fn(db);
  await saveDB(db);
  return result;
}

export function generateId(prefix = ''): string {
  const r = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}_${r}` : r;
}

export async function exportUserData(userId: string) {
  const db = await getDB();
  return {
    user: db.users.find((u) => u.id === userId),
    favorites: db.favorites.filter((f) => f.userId === userId),
    reviews: db.reviews.filter((r) => r.userId === userId),
    comparisons: db.comparisons.filter((c) => c.userId === userId),
    activity: db.activity.filter((a) => a.userId === userId),
  };
}

export async function deleteUserData(userId: string) {
  await mutate((db) => {
    db.users = db.users.filter((u) => u.id !== userId);
    db.sessions = db.sessions.filter((s) => s.userId !== userId);
    db.favorites = db.favorites.filter((f) => f.userId !== userId);
    db.reviews = db.reviews.filter((r) => r.userId !== userId);
    db.comparisons = db.comparisons.filter((c) => c.userId !== userId);
    db.activity = db.activity.filter((a) => a.userId !== userId);
    db.resetTokens = db.resetTokens.filter((t) => t.userId !== userId);
  });
}
