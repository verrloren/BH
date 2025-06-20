"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Public menu actions - only fetch active and available items
export async function getPublicCategories() {
  try {
    const categories = await db.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        items: {
          where: {
            isActive: true,
            isAvailable: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      order: category.order,
      items: category.items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: Number(item.price),
        oldPrice: item.oldPrice ? Number(item.oldPrice) : null,
        image: item.image,
        isOnSale: item.isOnSale,
        order: item.order,
      })),
    }));
  } catch (error) {
    console.error("Error fetching public categories:", error);
    return [];
  }
}

export async function getPublicPromotions() {
  try {
    const promotions = await db.promotion.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return promotions.map(promotion => ({
      id: promotion.id,
      title: promotion.title,
      description: promotion.description,
      createdAt: promotion.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching public promotions:", error);
    return [];
  }
}

export async function revalidatePublicMenu() {
  revalidatePath('/');
  revalidatePath('/dashboard');
}
