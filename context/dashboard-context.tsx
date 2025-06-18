"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCategories, getMenuItems, getPromotions } from '@/actions/dashboard';

interface Category {
  id: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  itemCount: number;
}

interface MenuItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  image: string | null;
  isOnSale: boolean;
  isActive: boolean;
  isAvailable: boolean;
  order: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string;
}

interface Promotion {
  id: string;
  title: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface DashboardContextType {
  categories: Category[];
  menuItems: MenuItem[];
  promotions: Promotion[];
  isLoading: boolean;
  refreshCategories: () => Promise<void>;
  refreshMenuItems: () => Promise<void>;
  refreshPromotions: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error refreshing categories:', error);
    }
  };

  const refreshMenuItems = async () => {
    try {
      const itemsData = await getMenuItems();
      setMenuItems(itemsData);
    } catch (error) {
      console.error('Error refreshing menu items:', error);
    }
  };

  const refreshPromotions = async () => {
    try {
      const promotionsData = await getPromotions();
      setPromotions(promotionsData);
    } catch (error) {
      console.error('Error refreshing promotions:', error);
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        refreshCategories(),
        refreshMenuItems(),
        refreshPromotions()
      ]);
    } catch (error) {
      console.error('Error refreshing all data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    refreshAll();
  }, []);

  const value = {
    categories,
    menuItems,
    promotions,
    isLoading,
    refreshCategories,
    refreshMenuItems,
    refreshPromotions,
    refreshAll,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
