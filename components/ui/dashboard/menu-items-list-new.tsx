"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  toggleMenuItemActive,
  toggleMenuItemAvailable,
  deleteMenuItem,
} from "@/actions/dashboard";
import { useTransition, useState } from "react";
import { useDashboard } from "@/context/dashboard-context";
import { toast } from "sonner";
import { MenuItemEditForm } from "./menu-item-edit-form";

export function MenuItemsList() {
  const { menuItems, refreshMenuItems, isLoading } = useDashboard();
  const [isPending, startTransition] = useTransition();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleToggleActive = (id: string) => {
    startTransition(async () => {
      const result = await toggleMenuItemActive(id);
      if (result.success) {
        await refreshMenuItems();
        toast.success("Menu item status updated!");
      } else {
        toast.error("Failed to update menu item status");
      }
    });
  };

  const handleToggleAvailable = (id: string) => {
    startTransition(async () => {
      const result = await toggleMenuItemAvailable(id);
      if (result.success) {
        await refreshMenuItems();
        toast.success("Menu item availability updated!");
      } else {
        toast.error("Failed to update menu item availability");
      }
    });
  };

  const handleEdit = (id: string) => {
    setEditingItemId(id);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleSaveEdit = () => {
    setEditingItemId(null);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteMenuItem(id);
      if (result.success) {
        await refreshMenuItems();
        toast.success("Menu item deleted successfully!");
      } else {
        toast.error("Failed to delete menu item");
      }
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-transparent border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Menu Items List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    const categoryName = item.categoryName;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <Card className="bg-transparent border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Menu Items List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([categoryName, items]) => (
            <div key={categoryName} className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-white">{categoryName}</h3>
                <div className="flex-1 h-px bg-neutral-700"></div>
                <span className="text-sm text-neutral-400">({items.length} items)</span>
              </div>
              
              <div className="ml-4 space-y-4">
                {items.map((item) => {
                  const isEditing = editingItemId === item.id;
                  
                  return (
                    <div key={item.id} className="space-y-4">
                      {isEditing ? (
                        <MenuItemEditForm 
                          menuItem={item}
                          onCancel={handleCancelEdit}
                          onSave={handleSaveEdit}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-between p-4 bg-transparent border rounded-lg border-neutral-800 sm:flex-row">
                          <div className="flex-1">
                            <div className="flex-1 mb-1">
                              <h3 className="font-semibold text-white">{item.title}</h3>
                              {item.description && (
                                <p className="mb-2 text-sm text-neutral-400">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {item.isOnSale && <Badge variant="destructive">Sale</Badge>}
                                <Badge variant={item.isActive ? "default" : "secondary"}>
                                  {item.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                  {item.isAvailable ? "Available" : "Unavailable"}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.isOnSale && item.oldPrice ? (
                                <>
                                  <span className="text-lg font-bold text-green-400">
                                    {item.price} lari
                                  </span>
                                  <span className="text-sm line-through text-neutral-600">
                                    {item.oldPrice} lari
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-white">
                                  {item.price} lari
                                </span>
                              )}
                              <span className="text-xs text-neutral-600">
                                • Order: {item.order}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 pt-4 md:pt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleActive(item.id)}
                              title={item.isActive ? "Deactivate" : "Activate"}
                              className="bg-transparent border-neutral-800 text-neutral-400 hover:brightness-110"
                            >
                              {item.isActive ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAvailable(item.id)}
                              title={
                                item.isAvailable ? "Make unavailable" : "Make available"
                              }
                              className="bg-transparent border-neutral-800 text-neutral-400 hover:brightness-110"
                            >
                              {item.isAvailable ? "✓" : "✗"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item.id)}
                              className="bg-transparent border-neutral-800 text-neutral-400 hover:brightness-110"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="bg-transparent border-neutral-800 text-neutral-400 hover:brightness-110"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
