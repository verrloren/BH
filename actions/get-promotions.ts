"use server";

import { getPosterPromotions } from "@/lib/poster-service";
import type { Promotion } from "@/types/types";

export async function getPromotions(): Promise<Promotion[]> {
  return getPosterPromotions();
}

