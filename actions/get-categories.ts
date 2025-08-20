"use server";

import { cookies } from "next/headers";

function getPosterIntegrationURL(): string | null {
  const raw = (process.env.POSTER_INTEGRATION || "").trim();
  if (!raw) return null;
  try { if (raw.includes("://")) return new URL(raw).host; } catch {}
  if (raw.endsWith(".joinposter.com")) return raw;
  return `${raw}.joinposter.com`;
}

export async function getCategories() {
  try {
    const token = (await cookies()).get("poster_access_token")?.value;
    const integrationUrl = getPosterIntegrationURL();
    if (!token || !integrationUrl) return [];

    const url = new URL(`https://${integrationUrl}/api/menu.getCategories`);
    url.searchParams.set("token", token);
    url.searchParams.set("fiscal", "0");

    const res = await fetch(url.toString(), { cache: "no-store" });
    const data: any = await res.json().catch(() => null);
    if (!res.ok || data?.error) {
      console.error("Poster categories fetch failed", { status: res.status, error: data?.error });
      return [];
    }

    const list = Array.isArray(data?.response) ? data.response : [];
    return list.map((c: any) => ({
      id: String(c.category_id ?? c.menu_category_id ?? c.id),
      name: String(c.category_name ?? c.name ?? "Category"),
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

