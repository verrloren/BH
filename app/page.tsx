import Container from "@/components/container";
import { Logo } from "@/components/logo";
import { MenuCategory } from "@/components/ui/menu/menu-category";
import { PromotionsDisplay } from "@/components/ui/menu/promotions-display";
import { CredentialsInfo } from "@/components/ui/menu/credentials-info";
import { DescriptionInfo } from "@/components/ui/menu/description-info";
import { MenuNavigation } from "@/components/ui/menu/menu-navigation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCategories } from "@/actions/dashboard";
import { env } from "process";

export const dynamic = 'force-dynamic';

type PosterPrice = number | string | Record<string, string | number>;

type PosterProduct = {
  product_id: string;
  product_name: string;
  price: PosterPrice; // can be object like {1: '1200'} or a number/string
  category_id?: string;
};

type PosterCategory = {
  id: string;      // Poster: category_id
  name: string;    // Poster: category_name
};

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
  try {
    if (raw.includes("://")) {
      const host = new URL(raw).host;
      return host.replace(".joinposter.com", "");
    }
  } catch {}
  if (raw.endsWith(".joinposter.com")) return raw.replace(".joinposter.com", "");
  return raw;
}

// Build Poster authorization URL
function getPosterAuthUrl() {
  const INTEGRATION_URL = getPosterIntegrationURL();
  const appId = process.env.POSTER_APP_ID;
  const redirectUri = process.env.POSTER_REDIRECT_URI;
  const accountParam = getIntegrationAccount();
  if (!INTEGRATION_URL || !appId || !redirectUri || !accountParam) return null;

  const url = new URL(`https://${INTEGRATION_URL}/api/auth`);
  url.searchParams.set("application_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("account", accountParam); // important: merchant account
  return url.toString();
}

// Exchange authorization code for access token
async function exchangeCodeForToken(code: string) {
	const INTEGRATION_URL = getPosterIntegrationURL();
  const appId = process.env.POSTER_APP_ID;
  const appSecret = process.env.POSTER_APP_SECRET;
  const redirectUri = process.env.POSTER_REDIRECT_URI;
  const accountParam = getIntegrationAccount();

  if (!appId || !appSecret || !redirectUri || !INTEGRATION_URL || !accountParam) {
    console.error("Missing Poster OAuth env vars or INTEGRATION_URL/account");
    return null;
  }

  const body = new URLSearchParams({
    application_id: appId,
    application_secret: appSecret,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
    account: accountParam, // must be merchant account
  });

  const tokenUrl = `https://${INTEGRATION_URL}/api/auth/access_token`;
  console.log("Exchanging code at:", tokenUrl);

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.access_token) {
    console.error("Poster token exchange failed", res.status, data);
    return null;
  }

  console.log("Poster token exchange successful:", data);

  return data as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
  };
}

async function refreshAccessToken(refreshToken: string) {
  const INTEGRATION_URL = getPosterIntegrationURL();
  const appId = process.env.POSTER_APP_ID;
  const appSecret = process.env.POSTER_APP_SECRET;
  const accountParam = getIntegrationAccount();
  if (!appId || !appSecret || !refreshToken || !INTEGRATION_URL || !accountParam) return null;

  const body = new URLSearchParams({
    application_id: appId,
    application_secret: appSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    account: accountParam, // must be merchant account
  });

  const res = await fetch(`https://${INTEGRATION_URL}/api/auth/refresh_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.access_token) {
    console.error("Poster token refresh failed", res.status, data);
    return null;
  }
  return data as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
  };
}

// Small helper to call Poster Integration API with auto-refresh on token error
async function posterIntegrationRequest(endpoint: string, params: Record<string, string>) {
  const cookieStore = await cookies();
  const access = cookieStore.get("poster_access_token")?.value || null;
  const refresh = cookieStore.get("poster_refresh_token")?.value || null;

  const INTEGRATION_URL = getPosterIntegrationURL();
  if (!INTEGRATION_URL) {
    console.error("Poster integration host is not configured (POSTER_INTEGRATION missing)");
    return { ok: false as const, data: null as any };
  }
  if (!access) {
    console.warn("No Poster access token in cookies");
    return { ok: false as const, data: null as any };
  }

  const accountParam = getIntegrationAccount();

  const buildUrl = (token: string) => {
    const url = new URL(`https://${INTEGRATION_URL}/api/${endpoint}`);
    url.searchParams.set("token", token);
    // include merchant account for integration requests
    if (!("account" in params) && accountParam) {
      url.searchParams.set("account", accountParam);
    }
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return url.toString();
  };

  const doFetch = async (token: string) => {
    const res = await fetch(buildUrl(token), { cache: "no-store" });
    const data = await res.json().catch(() => null);
    return { res, data };
  };

  let { res, data } = await doFetch(access);
	console.log('res', res)
	console.log('data', data)
  const tokenError = data?.error?.code === 11 || res.status === 401;

  if ((!res.ok || data?.error) && tokenError && refresh) {
    const refreshed = await refreshAccessToken(refresh);
    if (refreshed?.access_token) {
      try {
        const cs = await cookies();
        cs.set("poster_access_token", refreshed.access_token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          maxAge: refreshed.expires_in ?? 3600,
        });
        if (refreshed.refresh_token) {
          cs.set("poster_refresh_token", refreshed.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 3600,
          });
        }
      } catch (err) {
        console.warn("Unable to set refreshed Poster cookies in this context (ok to ignore on pages):", err);
      }
      ({ res, data } = await doFetch(refreshed.access_token));
    } else {
      console.error("Token refresh failed; cannot retry integration request");
    }
  }

  if (!res.ok || data?.error) {
    console.error(`Poster integration request failed: ${endpoint}`, {
      status: res.status,
      error: data?.error,
    });
    return { ok: false as const, data };
  }

  return { ok: true as const, data };
}

async function fetchPosterCategories(): Promise<PosterCategory[]> {
  const { ok, data } = await posterIntegrationRequest("menu.getCategories", { fiscal: "0" });
  if (!ok) return [];

  const list = Array.isArray(data?.response) ? data.response : [];
  return list.map((c: any) => ({
    id: String(c.category_id ?? c.menu_category_id ?? c.id),
    name: String(c.category_name ?? c.name ?? "Category"),
  }));
}

// Take price from Poster (including price objects), divide by 100 only if it's an object.
function getMenuPrice(raw: PosterPrice): number {
  if (raw && typeof raw === "object") {
    const entries = Object.entries(raw);
    if (entries.length > 0) {
      const [, val] = entries.sort((a, b) => Number(a[0]) - Number(b[0]))[0];
      const num = typeof val === "string" ? parseFloat(val) : Number(val);
      return Number.isFinite(num) ? num / 100 : 0;
    }
    return 0;
  }
  const n = typeof raw === "string" ? parseFloat(raw) : Number(raw);
  return Number.isFinite(n) ? n : 0;
}

async function fetchPosterProducts(): Promise<PosterProduct[]> {
  const { ok, data } = await posterIntegrationRequest("menu.getProducts", {
    format: "json",
    fiscal: "0",
    type: "products",
  });
  if (!ok) return [];

  const list = Array.isArray(data?.response) ? data.response : [];
  return list.map((p: any) => ({
    product_id: String(p.product_id),
    product_name: String(p.product_name ?? p.name ?? "Product"),
    price: p.price, // keep raw Poster price (may be object)
    category_id: String(p.category_id ?? p.menu_category_id ?? ""),
  }));
}

// Main page: now awaits searchParams and handles ?code
export default async function Index({
  searchParams,
}: {
  searchParams?: Promise<{ code?: string; account?: string; error?: string }>;
}) {

  const cookieStore = await cookies();
  const posterToken = cookieStore.get("poster_access_token")?.value || null;
  const authUrl = getPosterAuthUrl();

  // If not authorized yet -> silently start OAuth under the hood
  if (!posterToken && authUrl) {
    redirect(authUrl);
  }

  // Fetch Poster data
  const [posterCategories, posterProducts] = await Promise.all([
    fetchPosterCategories(),
    fetchPosterProducts(),
  ]);

  // Map Poster -> app DTO for categories with items
  const categories = posterCategories
    .map((cat) => {
      const items = posterProducts
        .filter((p) => p.category_id && p.category_id === cat.id)
        .map((p) => ({
          id: p.product_id,
          title: p.product_name,
          description: null,
          price: getMenuPrice(p.price), // extract and divide by 100 if needed
          oldPrice: null,
          image: null,
          isOnSale: false,
          order: 0,
        }));
      return {
        id: cat.id,
        name: cat.name,
        description: null,
        order: 0,
        items,
      };
    })
    .filter((cat) => cat.items.length > 0); // hide empty categories

  // Map products to a “promotions-like” list so PromotionsDisplay can render them
  const promotions = posterProducts.map((p) => ({
    id: p.product_id,
    title: p.product_name,
    description: null,
    createdAt: new Date(),
  }));

  return (
    <Container>
      <div className="opacity-0 animate-fade-in animation-delay-500">
        <CredentialsInfo />
      </div>
      <Logo />
      <div className="pt-4 space-y-4">
        {/* categories passed here are already filtered */}
        <MenuNavigation categories={categories} promotions={promotions} />

        <div className="flex flex-col w-full pt-4 opacity-0 animate-fade-in animation-delay-1000 gap-y-8 md:gap-y-12">
          {/* Masonry-style categories container */}
          <div className="pt-2 columns-1 md:columns-2 xl:columns-3 gap-x-6 md:gap-x-12">
            {categories.map((category) => (
              <div
                key={category.id}
                id={`category-${category.id}`}
                className="mb-8 md:mb-10"
                style={{ breakInside: "avoid" }}
              >
                <MenuCategory category={category} />
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center text-neutral-500">
              <p>No menu items available at the moment.</p>
            </div>
          )}

          <div className="pt-4" id="promotions-section">
            <PromotionsDisplay promotions={promotions} />
          </div>
        </div>
      </div>
    </Container>
  );
}
