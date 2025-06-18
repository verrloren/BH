

export interface MenuItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  image: string | null;
  isOnSale: boolean;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  order: number;
  items: MenuItem[];
}

export interface MenuCategoryProps {
  category: Category;
}

export interface Promotion {
  id: string;
  title: string;
  description?: string | null;
  createdAt: Date;
}

export interface PromotionsDisplayProps {
  promotions: Promotion[];
}