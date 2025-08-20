"use server";

import { getPosterProducts } from "@/lib/poster-service";
import type { PosterProduct } from "@/lib/poster-service";

export async function getProducts(categoryId?: string): Promise<PosterProduct[]> {
  return getPosterProducts(categoryId);
}

