"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Category Actions
export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const order = parseInt(formData.get("order") as string) || 0;

    const category = await db.menuCategory.create({
      data: {
        name,
        description: description || null,
        order,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function getCategories() {
  try {
    const categories = await db.menuCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return categories.map(category => ({
      ...category,
      itemCount: category._count.items,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function toggleCategoryActive(categoryId: string) {
  try {
    const category = await db.menuCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    await db.menuCategory.update({
      where: { id: categoryId },
      data: { isActive: !category.isActive },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error toggling category:", error);
    return { success: false, error: "Failed to toggle category" };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await db.menuCategory.delete({
      where: { id: categoryId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

// Menu Item Actions
export async function createMenuItem(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const oldPrice = formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : null;
    const isOnSale = formData.get("isOnSale") === "true";
    const categoryId = formData.get("categoryId") as string;
    const order = parseInt(formData.get("order") as string) || 0;

    const menuItem = await db.menuItem.create({
      data: {
        title,
        description: description || null,
        price,
        oldPrice,
        isOnSale,
        categoryId,
        order,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, menuItem };
  } catch (error) {
    console.error("Error creating menu item:", error);
    return { success: false, error: "Failed to create menu item" };
  }
}

export async function getMenuItems() {
  try {
    const menuItems = await db.menuItem.findMany({
      orderBy: { order: "asc" },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    return menuItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: Number(item.price),
      oldPrice: item.oldPrice ? Number(item.oldPrice) : null,
      image: item.image,
      isOnSale: item.isOnSale,
      isActive: item.isActive,
      isAvailable: item.isAvailable,
      order: item.order,
      categoryId: item.categoryId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      categoryName: item.category.name,
    }));
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

export async function toggleMenuItemActive(itemId: string) {
  try {
    const item = await db.menuItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return { success: false, error: "Menu item not found" };
    }

    await db.menuItem.update({
      where: { id: itemId },
      data: { isActive: !item.isActive },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error toggling menu item:", error);
    return { success: false, error: "Failed to toggle menu item" };
  }
}

export async function toggleMenuItemAvailable(itemId: string) {
  try {
    const item = await db.menuItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return { success: false, error: "Menu item not found" };
    }

    await db.menuItem.update({
      where: { id: itemId },
      data: { isAvailable: !item.isAvailable },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error toggling menu item availability:", error);
    return { success: false, error: "Failed to toggle menu item availability" };
  }
}

export async function deleteMenuItem(itemId: string) {
  try {
    await db.menuItem.delete({
      where: { id: itemId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return { success: false, error: "Failed to delete menu item" };
  }
}

// Promotion Actions
export async function createPromotion(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const promotion = await db.promotion.create({
      data: {
        title,
        description,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, promotion };
  } catch (error) {
    console.error("Error creating promotion:", error);
    return { success: false, error: "Failed to create promotion" };
  }
}

export async function getPromotions() {
  try {
    const promotions = await db.promotion.findMany({
      orderBy: { createdAt: "desc" },
    });

    return promotions;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return [];
  }
}

export async function togglePromotionActive(promotionId: string) {
  try {
    const promotion = await db.promotion.findUnique({
      where: { id: promotionId },
    });

    if (!promotion) {
      return { success: false, error: "Promotion not found" };
    }

    await db.promotion.update({
      where: { id: promotionId },
      data: { isActive: !promotion.isActive },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error toggling promotion:", error);
    return { success: false, error: "Failed to toggle promotion" };
  }
}

export async function deletePromotion(promotionId: string) {
  try {
    await db.promotion.delete({
      where: { id: promotionId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return { success: false, error: "Failed to delete promotion" };
  }
}
