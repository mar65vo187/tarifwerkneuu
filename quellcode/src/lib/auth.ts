import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { employees, type Employee } from "@/db/schema";

const COOKIE_NAME = "tw_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 Tage

/* ------------------------------------------------------------------ */
/*  Secret handling                                                    */
/* ------------------------------------------------------------------ */

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  // Fallback für lokale Sandbox: abgeleitet, aber niemals im Client sichtbar.
  const base = process.env.DATABASE_URL ?? "tarifwerk-local";
  return createHmac("sha256", "tarifwerk-session-fallback").update(base).digest("hex");
}

/* ------------------------------------------------------------------ */
/*  Passwords                                                          */
/* ------------------------------------------------------------------ */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

/* ------------------------------------------------------------------ */
/*  Signed session tokens (stateless, HMAC-SHA256)                     */
/* ------------------------------------------------------------------ */

type SessionPayload = { uid: number; exp: number };

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function createSessionToken(userId: number): string {
  const payload: SessionPayload = {
    uid: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readSessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (typeof payload.uid !== "number" || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Cookie helpers                                                     */
/* ------------------------------------------------------------------ */

export async function setSessionCookie(userId: number, secure: boolean) {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export type SessionUser = Pick<Employee, "id" | "name" | "email" | "role" | "advisorId">;

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const payload = readSessionToken(store.get(COOKIE_NAME)?.value);
  if (!payload) return null;
  try {
    const [user] = await db
      .select({
        id: employees.id,
        name: employees.name,
        email: employees.email,
        role: employees.role,
        advisorId: employees.advisorId,
        active: employees.active,
      })
      .from(employees)
      .where(eq(employees.id, payload.uid))
      .limit(1);
    if (!user || !user.active) return null;
    return { id: user.id, name: user.name, email: user.email, role: user.role, advisorId: user.advisorId };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
