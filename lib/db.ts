interface D1PreparedStatement {
  bind(...values: unknown[]): this;
  first<T = unknown>(col?: string): Promise<T | null>;
  run<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean }>;
}

interface D1Database {
  prepare(sql: string): D1PreparedStatement;
}

function getD1(): D1Database {
  const ctx = (globalThis as any).getRequestContext?.();
  if (ctx?.env?.DB) return ctx.env.DB as D1Database;
  throw new Error('D1 database binding not found - ensure you are running on Cloudflare Workers with a D1 binding named "DB"');
}

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

export function generateId(prefix = ''): string {
  const r = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}_${r}` : r;
}

function rowToUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    passwordHash: row.password_hash,
    displayName: row.display_name ?? undefined,
    bio: row.bio ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at ?? undefined,
    emailVerified: !!row.email_verified,
    preferences: typeof row.preferences === 'string' ? JSON.parse(row.preferences) : row.preferences,
  };
}

function rowToSession(row: any): Session {
  return {
    id: row.id,
    userId: row.user_id,
    token: row.token,
    expiresAt: row.expires_at,
    userAgent: row.user_agent ?? undefined,
    ipAddress: row.ip_address ?? undefined,
    createdAt: row.created_at,
  };
}

function rowToFavorite(row: any): Favorite {
  return {
    id: row.id,
    userId: row.user_id,
    modelId: row.model_id,
    createdAt: row.created_at,
    note: row.note ?? undefined,
  };
}

function rowToReview(row: any): Review {
  return {
    id: row.id,
    userId: row.user_id,
    modelId: row.model_id,
    rating: row.rating,
    title: row.title ?? undefined,
    content: row.content,
    pros: JSON.parse(row.pros || '[]'),
    cons: JSON.parse(row.cons || '[]'),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    helpful: row.helpful,
    reported: !!row.reported,
  };
}

function rowToComparison(row: any): SavedComparison {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    modelIds: JSON.parse(row.model_ids || '[]'),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToActivity(row: any): Activity {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    modelId: row.model_id ?? undefined,
    meta: row.meta ? JSON.parse(row.meta) : undefined,
    createdAt: row.created_at,
  };
}

export async function dbGetUserByEmail(email: string): Promise<User | null> {
  const row = await getD1().prepare('SELECT * FROM users WHERE email = ?').bind(email).first<any>();
  return row ? rowToUser(row) : null;
}

export async function dbGetUserByUsername(username: string): Promise<User | null> {
  const row = await getD1().prepare('SELECT * FROM users WHERE username = ?').bind(username).first<any>();
  return row ? rowToUser(row) : null;
}

export async function dbGetUserById(id: string): Promise<User | null> {
  const row = await getD1().prepare('SELECT * FROM users WHERE id = ?').bind(id).first<any>();
  return row ? rowToUser(row) : null;
}

export async function dbCreateUser(user: {
  id: string; email: string; username: string; passwordHash: string;
  displayName?: string; role: string; createdAt: string; updatedAt: string;
  emailVerified: boolean; preferences: string;
}): Promise<void> {
  await getD1().prepare(
    'INSERT INTO users (id, email, username, password_hash, display_name, role, created_at, updated_at, email_verified, preferences) VALUES (?,?,?,?,?,?,?,?,?,?)'
  ).bind(
    user.id, user.email, user.username, user.passwordHash,
    user.displayName ?? null, user.role, user.createdAt, user.updatedAt,
    user.emailVerified ? 1 : 0, user.preferences
  ).run();
}

export async function dbUpdateUser(id: string, updates: Partial<User>): Promise<void> {
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (updates.displayName !== undefined) { sets.push('display_name = ?'); vals.push(updates.displayName); }
  if (updates.bio !== undefined) { sets.push('bio = ?'); vals.push(updates.bio); }
  if (updates.avatarUrl !== undefined) { sets.push('avatar_url = ?'); vals.push(updates.avatarUrl); }
  if (updates.role !== undefined) { sets.push('role = ?'); vals.push(updates.role); }
  if (updates.passwordHash !== undefined) { sets.push('password_hash = ?'); vals.push(updates.passwordHash); }
  if (updates.lastLoginAt !== undefined) { sets.push('last_login_at = ?'); vals.push(updates.lastLoginAt); }
  if (updates.preferences !== undefined) { sets.push('preferences = ?'); vals.push(JSON.stringify(updates.preferences)); }
  if (updates.emailVerified !== undefined) { sets.push('email_verified = ?'); vals.push(updates.emailVerified ? 1 : 0); }
  sets.push('updated_at = ?');
  vals.push(new Date().toISOString());
  vals.push(id);
  if (sets.length > 1) {
    await getD1().prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
  }
}

export async function dbDeleteUser(id: string): Promise<void> {
  await getD1().prepare('DELETE FROM users WHERE id = ?').bind(id).run();
}

export async function dbGetUsersByIds(ids: string[]): Promise<User[]> {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(',');
  const { results } = await getD1().prepare(`SELECT * FROM users WHERE id IN (${placeholders})`).bind(...ids).all<any>();
  return results.map(rowToUser);
}

export async function dbCreateSession(session: Session): Promise<void> {
  await getD1().prepare(
    'INSERT INTO sessions (id, user_id, token, expires_at, user_agent, ip_address, created_at) VALUES (?,?,?,?,?,?,?)'
  ).bind(
    session.id, session.userId, session.token, session.expiresAt,
    session.userAgent ?? null, session.ipAddress ?? null, session.createdAt
  ).run();
  await getD1().prepare('DELETE FROM sessions WHERE expires_at < ?').bind(new Date().toISOString()).run();
}

export async function dbGetSessionByToken(token: string): Promise<Session | null> {
  const row = await getD1().prepare('SELECT * FROM sessions WHERE token = ? AND expires_at > ?').bind(token, new Date().toISOString()).first<any>();
  return row ? rowToSession(row) : null;
}

export async function dbDeleteSession(token: string): Promise<void> {
  await getD1().prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
}

export async function dbDeleteSessionsByUserId(userId: string): Promise<void> {
  await getD1().prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId).run();
}

export async function dbGetUserFavorites(userId: string): Promise<Favorite[]> {
  const { results } = await getD1().prepare('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all<any>();
  return results.map(rowToFavorite);
}

export async function dbGetFavorite(userId: string, modelId: string): Promise<Favorite | null> {
  const row = await getD1().prepare('SELECT * FROM favorites WHERE user_id = ? AND model_id = ?').bind(userId, modelId).first<any>();
  return row ? rowToFavorite(row) : null;
}

export async function dbCreateFavorite(fav: Favorite): Promise<void> {
  await getD1().prepare(
    'INSERT INTO favorites (id, user_id, model_id, note, created_at) VALUES (?,?,?,?,?)'
  ).bind(fav.id, fav.userId, fav.modelId, fav.note ?? null, fav.createdAt).run();
}

export async function dbDeleteFavorite(userId: string, modelId: string): Promise<void> {
  await getD1().prepare('DELETE FROM favorites WHERE user_id = ? AND model_id = ?').bind(userId, modelId).run();
}

export async function dbGetReviews(modelId?: string, userId?: string): Promise<any[]> {
  let sql = 'SELECT * FROM reviews WHERE reported = 0';
  const vals: unknown[] = [];
  if (modelId) { sql += ' AND model_id = ?'; vals.push(modelId); }
  if (userId) { sql += ' AND user_id = ?'; vals.push(userId); }
  sql += ' ORDER BY created_at DESC';
  const { results } = await getD1().prepare(sql).bind(...vals).all<any>();
  const reviews = results.map(rowToReview);
  const userIds = [...new Set(reviews.map((r: Review) => r.userId))];
  const users = await dbGetUsersByIds(userIds);
  const userMap = new Map(users.map((u) => [u.id, u]));
  return reviews.map((r: Review) => ({
    ...r,
    author: userMap.has(r.userId)
      ? { id: r.userId, username: userMap.get(r.userId)!.username, displayName: userMap.get(r.userId)!.displayName || userMap.get(r.userId)!.username, avatarUrl: userMap.get(r.userId)!.avatarUrl }
      : null,
  }));
}

export async function dbGetReviewByUserAndModel(userId: string, modelId: string): Promise<Review | null> {
  const row = await getD1().prepare('SELECT * FROM reviews WHERE user_id = ? AND model_id = ?').bind(userId, modelId).first<any>();
  return row ? rowToReview(row) : null;
}

export async function dbCreateReview(review: Review): Promise<void> {
  await getD1().prepare(
    'INSERT INTO reviews (id, user_id, model_id, rating, title, content, pros, cons, created_at, updated_at, helpful, reported) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
  ).bind(
    review.id, review.userId, review.modelId, review.rating,
    review.title ?? null, review.content,
    JSON.stringify(review.pros), JSON.stringify(review.cons),
    review.createdAt, review.updatedAt, review.helpful, review.reported ? 1 : 0
  ).run();
}

export async function dbUpdateReview(id: string, updates: Partial<Review>): Promise<void> {
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (updates.rating !== undefined) { sets.push('rating = ?'); vals.push(updates.rating); }
  if (updates.title !== undefined) { sets.push('title = ?'); vals.push(updates.title); }
  if (updates.content !== undefined) { sets.push('content = ?'); vals.push(updates.content); }
  if (updates.pros !== undefined) { sets.push('pros = ?'); vals.push(JSON.stringify(updates.pros)); }
  if (updates.cons !== undefined) { sets.push('cons = ?'); vals.push(JSON.stringify(updates.cons)); }
  if (updates.helpful !== undefined) { sets.push('helpful = ?'); vals.push(updates.helpful); }
  if (updates.reported !== undefined) { sets.push('reported = ?'); vals.push(updates.reported ? 1 : 0); }
  sets.push('updated_at = ?');
  vals.push(new Date().toISOString());
  vals.push(id);
  if (sets.length > 1) {
    await getD1().prepare(`UPDATE reviews SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
  }
}

export async function dbDeleteReview(id: string): Promise<void> {
  await getD1().prepare('DELETE FROM reviews WHERE id = ?').bind(id).run();
}

export async function dbIncrementReviewHelpful(id: string): Promise<void> {
  await getD1().prepare('UPDATE reviews SET helpful = helpful + 1 WHERE id = ?').bind(id).run();
}

export async function dbGetUserComparisons(userId: string): Promise<SavedComparison[]> {
  const { results } = await getD1().prepare('SELECT * FROM comparisons WHERE user_id = ? ORDER BY updated_at DESC').bind(userId).all<any>();
  return results.map(rowToComparison);
}

export async function dbGetComparisonByIdAndUser(id: string, userId: string): Promise<SavedComparison | null> {
  const row = await getD1().prepare('SELECT * FROM comparisons WHERE id = ? AND user_id = ?').bind(id, userId).first<any>();
  return row ? rowToComparison(row) : null;
}

export async function dbCreateComparison(cmp: SavedComparison): Promise<void> {
  await getD1().prepare(
    'INSERT INTO comparisons (id, user_id, name, model_ids, created_at, updated_at) VALUES (?,?,?,?,?,?)'
  ).bind(cmp.id, cmp.userId, cmp.name, JSON.stringify(cmp.modelIds), cmp.createdAt, cmp.updatedAt).run();
}

export async function dbUpdateComparison(id: string, updates: Partial<SavedComparison>): Promise<void> {
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (updates.name !== undefined) { sets.push('name = ?'); vals.push(updates.name); }
  if (updates.modelIds !== undefined) { sets.push('model_ids = ?'); vals.push(JSON.stringify(updates.modelIds)); }
  sets.push('updated_at = ?');
  vals.push(new Date().toISOString());
  vals.push(id);
  if (sets.length > 1) {
    await getD1().prepare(`UPDATE comparisons SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
  }
}

export async function dbDeleteComparison(id: string, userId: string): Promise<void> {
  await getD1().prepare('DELETE FROM comparisons WHERE id = ? AND user_id = ?').bind(id, userId).run();
}

export async function dbGetUserActivity(userId: string, limit = 50): Promise<Activity[]> {
  const { results } = await getD1().prepare(
    'SELECT * FROM activity WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).bind(userId, limit).all<any>();
  return results.map(rowToActivity);
}

export async function dbCreateActivity(act: Activity): Promise<void> {
  await getD1().prepare(
    'INSERT INTO activity (id, user_id, type, model_id, meta, created_at) VALUES (?,?,?,?,?,?)'
  ).bind(act.id, act.userId, act.type, act.modelId ?? null, act.meta ? JSON.stringify(act.meta) : null, act.createdAt).run();
}

export async function dbTrimActivity(userId: string, maxRows = 2000): Promise<void> {
  const row = await getD1().prepare(
    'SELECT created_at FROM activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 1 OFFSET ?'
  ).bind(userId, maxRows).first<any>();
  if (row) {
    await getD1().prepare('DELETE FROM activity WHERE user_id = ? AND created_at < ?').bind(userId, row.created_at).run();
  }
}

export async function dbDeleteActivityByUserId(userId: string): Promise<void> {
  await getD1().prepare('DELETE FROM activity WHERE user_id = ?').bind(userId).run();
}

export async function exportUserData(userId: string) {
  const user = await dbGetUserById(userId);
  const favorites = await dbGetUserFavorites(userId);
  const reviews = await dbGetReviews(undefined, userId);
  const { results: cmpRows } = await getD1().prepare('SELECT * FROM comparisons WHERE user_id = ?').bind(userId).all<any>();
  const comparisons = cmpRows.map(rowToComparison);
  const { results: actRows } = await getD1().prepare('SELECT * FROM activity WHERE user_id = ?').bind(userId).all<any>();
  const activity = actRows.map(rowToActivity);
  return { user, favorites, reviews, comparisons, activity };
}

export async function deleteUserData(userId: string): Promise<void> {
  const d1 = getD1();
  await d1.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId).run();
  await d1.prepare('DELETE FROM favorites WHERE user_id = ?').bind(userId).run();
  await d1.prepare('DELETE FROM reviews WHERE user_id = ?').bind(userId).run();
  await d1.prepare('DELETE FROM comparisons WHERE user_id = ?').bind(userId).run();
  await d1.prepare('DELETE FROM activity WHERE user_id = ?').bind(userId).run();
  await d1.prepare('DELETE FROM reset_tokens WHERE user_id = ?').bind(userId).run();
  await d1.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
}
