import { NextResponse } from "next/server";
import { posterFetch } from "@/lib/poster-service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = (url.searchParams.get("type") || "products").toLowerCase();
  const categoryId =
    url.searchParams.get("category_id") || url.searchParams.get("categoryId") || undefined;

  try {
    if (type === "categories") {
      const result = await posterFetch<any>("menu.getCategories", { fiscal: "0" });
      if (!result.ok) {
        return NextResponse.json(
          { error: "Failed to fetch categories", detail: result.error },
          { status: result.status || 502 }
        );
      }
      const payload = (result.data as any)?.response ?? [];
      return NextResponse.json(payload);
    }

    // default: products
    const result = await posterFetch<any>("menu.getProducts", {
      format: "json",
      fiscal: "0",
      type: "products",
      ...(categoryId ? { category_id: categoryId } : {}),
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products", detail: result.error },
        { status: result.status || 502 }
      );
    }

    const payload = (result.data as any)?.response ?? [];
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Poster proxy error:", error);
    return NextResponse.json({ error: "Poster proxy error" }, { status: 500 });
  }
}