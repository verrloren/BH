import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function getPosterIntegrationURL(): string | null {
  const raw = (process.env.POSTER_INTEGRATION || "").trim();
  if (!raw) return null;
  try { if (raw.includes("://")) return new URL(raw).host; } catch {}
  if (raw.endsWith(".joinposter.com")) return raw;
  return `${raw}.joinposter.com`;
}

function getIntegrationAccount(): string | null {
  const raw = (process.env.POSTER_INTEGRATION_ACCOUNT || "").trim();
  if (!raw) return null;
  try { if (raw.includes("://")) return new URL(raw).host.replace(".joinposter.com", ""); } catch {}
  if (raw.endsWith(".joinposter.com")) return raw.replace(".joinposter.com", "");
  return raw;
}

async function exchangeCodeForToken(code: string) {
  const INTEGRATION_URL = getPosterIntegrationURL();
  const appId = process.env.POSTER_APP_ID;
  const appSecret = process.env.POSTER_APP_SECRET;
  const redirectUri = process.env.POSTER_REDIRECT_URI;
  const accountParam = getIntegrationAccount();
  if (!INTEGRATION_URL || !appId || !appSecret || !redirectUri || !accountParam) return null;

  const body = new URLSearchParams({
    application_id: appId,
    application_secret: appSecret,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
    account: accountParam,
  });

  const res = await fetch(`https://${INTEGRATION_URL}/api/auth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.access_token) return null;
  return data as { access_token: string; refresh_token?: string; expires_in?: number };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const res = NextResponse.redirect(new URL("/", url.origin));

  if (!code) return res;

  const token = await exchangeCodeForToken(code);
  if (!token?.access_token) return res;

  try {
    const account = getIntegrationAccount() || "default";
    const expiresAt =
      typeof token.expires_in === "number"
        ? new Date(Date.now() + token.expires_in * 1000)
        : new Date(Date.now() + 3600 * 1000);

    await db.posterAuth.upsert({
      where: { account },
      update: {
        accessToken: token.access_token,
        refreshToken: token.refresh_token ?? null,
        expiresAt,
      },
      create: {
        id: account,
        account,
        accessToken: token.access_token,
        refreshToken: token.refresh_token ?? null,
        expiresAt,
      },
    });
  } catch (e) {
    console.error("Failed to persist Poster tokens in DB. Ensure Prisma model exists.", e);
  }

  // Do not store tokens in cookies anymore; ensure any legacy cookies are cleared
  res.cookies.delete("poster_access_token");
  res.cookies.delete("poster_refresh_token");

  return res;
}