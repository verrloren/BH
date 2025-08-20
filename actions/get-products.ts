"use server";

import { getPosterProducts } from "@/lib/poster-service";

export async function getProducts(categoryId?: string) {
  return getPosterProducts(categoryId);
}

