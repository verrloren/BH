"use server";

import { getPosterCategories } from "@/lib/poster-service";

export async function getCategories() {
  return getPosterCategories();
}

