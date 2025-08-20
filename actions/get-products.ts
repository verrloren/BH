"use server";

import { cookies } from "next/headers";

function getPosterIntegrationURL(): string | null {
  const raw = (process.env.POSTER_INTEGRATION || "").trim();
  if (!raw) return null;
  try { if (raw.includes("://")) return new URL(raw).host; } catch {}
  if (raw.endsWith(".joinposter.com")) return raw;
  return `${raw}.joinposter.com`;
}

export async function getProducts(categoryId?: string) {
  try {
    const token = (await cookies()).get("poster_access_token")?.value;
    const integrationUrl = getPosterIntegrationURL();
    if (!token || !integrationUrl) return [];

    const url = new URL(`https://${integrationUrl}/api/menu.getProducts`);
    url.searchParams.set("token", token);
    url.searchParams.set("format", "json");
    url.searchParams.set("fiscal", "0");
    url.searchParams.set("type", "products");
    if (categoryId) url.searchParams.set("category_id", categoryId);

    const res = await fetch(url.toString(), { cache: "no-store" });
    const data: any = await res.json().catch(() => null);
    if (!res.ok || data?.error) {
      console.error("Poster products fetch failed", { status: res.status, error: data?.error });
      return [];
    }

    const list = Array.isArray(data?.response) ? data.response : [];
    return list.map((p: any) => ({
      id: String(p.product_id),
      title: String(p.product_name ?? p.name ?? "Product"),
      price: Number(p.price ?? 0),
      categoryId: String(p.category_id ?? p.menu_category_id ?? ""),
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

