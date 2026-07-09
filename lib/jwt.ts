import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'llm-compare-dev-secret-change-in-production-7f8a9b2c3d4e5f6a'
);
const COOKIE_NAME = 'llm_session';

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ sub: string; iat: number; exp: number } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { sub: payload.sub as string, iat: payload.iat as number, exp: payload.exp as number };
  } catch {
    return null;
  }
}

export function verifyTokenSync(token: string): { sub: string; iat: number; exp: number } | null {
  // For middleware/edge use, we still need async
  // Keep this stub to make types work — Edge runtime uses verifyToken async
  return null;
}

export { COOKIE_NAME };
