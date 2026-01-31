import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "admin_session";
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const secret = process.env.SECRET_KEY;
  if (!secret) {
    console.warn("SECRET_KEY is not set; using insecure default for development.");
    return "dev-secret";
  }
  return secret;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function isAuthenticated(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const secret = getSecret();
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((part) => {
      const [k, ...rest] = part.trim().split("=");
      return [k, rest.join("=")];
    })
  );
  const raw = cookies[COOKIE_NAME];
  if (!raw) return false;
  const [value, sig] = raw.split(".");
  if (!value || !sig) return false;
  const expected = sign(value, secret);
  return safeEqual(sig, expected) && value === "1";
}

export function authCookie(maxAge = DEFAULT_MAX_AGE): string {
  const secret = getSecret();
  const value = "1";
  const sig = sign(value, secret);
  return `${COOKIE_NAME}=${value}.${sig}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}
