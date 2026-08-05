import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'session';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

const encoder = new TextEncoder();

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-dev-secret-change-me';
  return encoder.encode(secret);
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
  // Explicitly set domain only in production to avoid issues in local dev
  ...(process.env.NODE_ENV === 'production' && {
    domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
  }),
};
