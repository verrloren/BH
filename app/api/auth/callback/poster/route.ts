import { NextRequest, NextResponse } from "next/server";

function getPosterHost(): string | null {
  const raw = (process.env.POSTER_ACCOUNT || "").trim();
  if (!raw) return null;
  try {
    if (raw.includes("://")) return new URL(raw).host;
  } catch {}
  if (raw.endsWith(".joinposter.com")) return raw;
  return `${raw}.joinposter.com`;
}

function getPosterAccountName(): string | null {
  const host = getPosterHost();
  if (!host) return null;
  return host.replace(".joinposter.com", "");
}

async function exchangeCodeForToken(code: string) {
  const appId = process.env.POSTER_APP_ID!;
  const appSecret = process.env.POSTER_APP_SECRET!;
  const redirectUri = process.env.POSTER_REDIRECT_URI!;
  const host = getPosterHost();
  const account = getPosterAccountName();

  if (!host || !account) {
    console.error("Poster host/account not configured");
    return null;
  }

  const tokenUrl = `https://${host}/api/auth/access_token`;
  const body = new URLSearchParams({
    application_id: appId,
    application_secret: appSecret,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
    account, // important for some Poster configurations
  });

  let data: any = null;
  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    data = await res.json().catch(() => null);
    if (!res.ok || !data?.access_token) {
      console.error("Poster token exchange failed", res.status, data);
      return null;
    }
  } catch (e) {
    console.error("Poster token exchange error", e, data);
    return null;
  }

  console.log("Poster token exchange successful");
  return data as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
  };
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const redirectTo = new URL("/", url.origin);

  if (!code) {
    console.error("Poster callback called without code");
    return NextResponse.redirect(redirectTo, 302);
  }

  const tokens = await exchangeCodeForToken(code);
  const res = NextResponse.redirect(redirectTo, 302);

  if (tokens?.access_token) {
    const maxAge = tokens.expires_in ?? 60 * 60 * 24 * 7; // default 7 days
    res.cookies.set("poster_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    if (tokens.refresh_token) {
      res.cookies.set("poster_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  } else {
    console.error("No access token received, redirecting back to /");
  }

  return res;
}
