"use server";

import { db } from "@/lib/db";
import type { Promotion as UIPromotion } from "@/types/types";

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

function isExpired(expiresAt: Date, skewMs = 60_000) {
  return Date.now() >= new Date(expiresAt).getTime() - skewMs;
}

async function refreshAccessToken(refreshToken: string) {
  const INTEGRATION_URL = getPosterIntegrationURL();
  const appId = process.env.POSTER_APP_ID;
  const appSecret = process.env.POSTER_APP_SECRET;
  const account = getIntegrationAccount();
  if (!INTEGRATION_URL || !appId || !appSecret || !account || !refreshToken) return null;

  const body = new URLSearchParams({
    application_id: appId,
    application_secret: appSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    account,
  });

  const res = await fetch(`https://${INTEGRATION_URL}/api/auth/refresh_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const data: any = await res.json().catch(() => null);
  if (!res.ok || !data?.access_token) return null;

  return {
    access_token: String(data.access_token),
    refresh_token: data.refresh_token ? String(data.refresh_token) : undefined,
    expires_in: typeof data.expires_in === "number" ? data.expires_in : undefined,
  };
}

async function getValidAccessToken(): Promise<string | null> {
  const account = getIntegrationAccount() || "default";
  const row = await db.posterAuth.findUnique({ where: { account } });
  if (!row) return null;

  if (!isExpired(row.expiresAt)) {
    return row.accessToken;
  }

  if (!row.refreshToken) return null;

  const refreshed = await refreshAccessToken(row.refreshToken);
  if (!refreshed?.access_token) return null;

  const expiresAt =
    typeof refreshed.expires_in === "number"
      ? new Date(Date.now() + refreshed.expires_in * 1000)
      : new Date(Date.now() + 3600 * 1000);

  await db.posterAuth.update({
    where: { account },
    data: {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? row.refreshToken,
      expiresAt,
    },
  });

  return refreshed.access_token;
}

export async function posterFetch<T = any>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): Promise<{ ok: true; data: T } | { ok: false; status: number; error?: any }> {
  const INTEGRATION_URL = getPosterIntegrationURL();
  const account = getIntegrationAccount();
  if (!INTEGRATION_URL || !account) return { ok: false, status: 500, error: "Poster Integration not configured" };

  let token = await getValidAccessToken();
  if (!token) return { ok: false, status: 401, error: "No valid Poster token" };

  const buildUrl = (tkn: string) => {
    const url = new URL(`https://${INTEGRATION_URL}/api/${endpoint}`);
    url.searchParams.set("token", tkn);
    if (!("account" in params)) url.searchParams.set("account", account);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
    return url.toString();
  };

  const doOnce = async (tkn: string) => {
    const res = await fetch(buildUrl(tkn), { cache: "no-store" });
    const data: any = await res.json().catch(() => null);
    return { res, data };
  };

  // initial try
  let { res, data } = await doOnce(token);
  const tokenError = res.status === 401 || data?.error?.code === 11;

  // try refresh on token error (even if not expired)
  if ((!res.ok || data?.error) && tokenError) {
    token = await getValidAccessToken(); // will refresh if needed
    if (token) {
      ({ res, data } = await doOnce(token));
    }
  }

  if (!res.ok || data?.error) {
    return { ok: false, status: res.status, error: data?.error ?? data };
  }

  return { ok: true, data: data as T };
}

// NEW: build OAuth URL for Poster integration
export async function getPosterAuthUrl(): Promise<string | null> {
  const INTEGRATION_URL = getPosterIntegrationURL();
  const appId = process.env.POSTER_APP_ID;
  const redirectUri = process.env.POSTER_REDIRECT_URI;
  const accountParam = getIntegrationAccount();
  if (!INTEGRATION_URL || !appId || !redirectUri || !accountParam) return null;

  const url = new URL(`https://${INTEGRATION_URL}/api/auth`);
  url.searchParams.set("application_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("account", accountParam);
  return url.toString();
}

export async function getPosterCategories() {
  try {
    const result = await posterFetch<any>("menu.getCategories", { fiscal: "0" });
    if (!result.ok) return [];
    const list = Array.isArray((result.data as any)?.response) ? (result.data as any).response : [];
    return list.map((c: any) => ({
      id: String(c.category_id ?? c.menu_category_id ?? c.id),
      name: String(c.category_name ?? c.name ?? "Category"),
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Poster price can be scalar or per-spot object (e.g., {1: '1200'})
type PosterPrice = number | string | Record<string, string | number>;

// Normalize Poster price; if object, take the first value and divide by 100
function normalizePosterPrice(raw: PosterPrice): number {
  if (raw && typeof raw === "object") {
    const entries = Object.entries(raw);
    if (entries.length > 0) {
      const [, val] = entries[0];
      const num = typeof val === "string" ? parseFloat(val) : Number(val);
      return Number.isFinite(num) ? num / 100 : 0;
    }
    return 0;
  }
  const n = typeof raw === "string" ? parseFloat(raw) : Number(raw);
  return Number.isFinite(n) ? n : 0;
}

// Exported normalized product DTO
export type PosterProduct = {
  id: string;
  title: string;
  price: number; // normalized number ready for UI
  categoryId: string;
};

export async function getPosterProducts(categoryId?: string) {
  try {
    const result = await posterFetch<any>("menu.getProducts", {
      format: "json",
      fiscal: "0",
      type: "products",
      ...(categoryId ? { category_id: categoryId } : {}),
    });
    if (!result.ok) return [];
    const list = Array.isArray((result.data as any)?.response) ? (result.data as any).response : [];
    return list.map((p: any) => ({
      id: String(p.product_id),
      title: String(p.product_name ?? p.name ?? "Product"),
      price: normalizePosterPrice(p.price as PosterPrice),
      categoryId: String(p.category_id ?? p.menu_category_id ?? ""),
    })) as PosterProduct[];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Helper to parse Poster datetime strings like "2024-04-29 00:00:00"
function parsePosterDate(s?: string | null): Date | null {
  if (!s || s.startsWith("0000-00-00")) return null;
  // Avoid timezone shift; treat as local time
  const iso = s.replace(" ", "T");
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

// NEW: Fetch promotions from Poster Integration
export async function getPosterPromotions(): Promise<UIPromotion[]> {
  try {
    const result = await posterFetch<any>("clients.getPromotions", {});
    if (!result.ok) return [];
    const list = Array.isArray((result.data as any)?.response) ? (result.data as any).response : [];

    return list.map((p: any) => ({
      id: String(p.promotion_id),
      title: String(p.name ?? "Promotion"),
      description: null,
      dateStart: parsePosterDate(p.date_start),
      dateEnd: parsePosterDate(p.date_end),
      autoApply: String(p.auto_apply ?? "0") === "1",
    })) as UIPromotion[];
  } catch (err) {
    console.error("Failed to fetch Poster promotions", err);
    return [];
  }
}
