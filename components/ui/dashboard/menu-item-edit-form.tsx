"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateMenuItem } from "@/actions/dashboard";
import { useState, useTransition } from "react";
import { useDashboard } from "@/context/dashboard-context";
import { toast } from "sonner";

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

interface MenuItemEditFormProps {
  menuItem: MenuItem;
  onCancel: () => void;
  onSave: () => void;
}

export function MenuItemEditForm({ menuItem, onCancel, onSave }: MenuItemEditFormProps) {
  const [title, setTitle] = useState(menuItem.title);
  const [description, setDescription] = useState(menuItem.description || "");
  const [price, setPrice] = useState(menuItem.price.toString());
  const [oldPrice, setOldPrice] = useState(menuItem.oldPrice?.toString() || "");
  const [categoryId, setCategoryId] = useState(menuItem.categoryId);
  const [order, setOrder] = useState(menuItem.order);
  const [isPending, startTransition] = useTransition();
  const { categories, refreshMenuItems } = useDashboard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("id", menuItem.id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("oldPrice", oldPrice);
    formData.append("categoryId", categoryId);
    formData.append("order", order.toString());

    startTransition(async () => {
      const result = await updateMenuItem(formData);
      if (result.success) {
        await refreshMenuItems();
        toast.success("Menu item updated successfully!");
        onSave();
      } else {
        console.error("Error updating menu item:", result.error);
        toast.error("Failed to update menu item");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 border rounded-lg bg-neutral-900 border-neutral-700">
      <h3 className="text-lg font-semibold text-white">Edit Menu Item</h3>
      
      <div>
        <Label htmlFor="edit-title" className="text-white">Item Title</Label>
        <Input
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g.: Craft Lager"
          required
          className="text-white bg-neutral-950 border-neutral-800 placeholder:text-neutral-500"
        />
      </div>
      
      <div>
        <Label htmlFor="edit-description" className="text-white">Description (optional)</Label>
        <Textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief item description"
          className="text-white bg-neutral-950 border-neutral-800 placeholder:text-neutral-500"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-price" className="text-white">Current Price</Label>
          <Input
            id="edit-price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
            className="text-white bg-neutral-950 border-neutral-800"
          />
        </div>
        
        <div>
          <Label htmlFor="edit-old-price" className="text-white">Old Price (for sale)</Label>
          <Input
            id="edit-old-price"
            type="number"
            step="0.01"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            placeholder="0.00"
            className="text-white bg-neutral-950 border-neutral-800"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="edit-category" className="text-white">Category</Label>
        <select 
          id="edit-category"
          value={categoryId} 
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 text-white bg-neutral-950 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a category</option>
          {categories
            .filter((cat) => cat.isActive)
            .map((category) => (
              <option 
                key={category.id} 
                value={category.id}
                className="text-white bg-neutral-950"
              >
                {category.name}
              </option>
            ))}
        </select>
      </div>
      
      <div>
        <Label htmlFor="edit-order" className="text-white">Sort Order</Label>
        <Input
          id="edit-order"
          type="number"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
          min="0"
          className="text-white bg-neutral-950 border-neutral-800"
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={isPending} 
          className="text-white bg-green-700 hover:bg-green-600"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="text-white bg-transparent border-neutral-600 hover:bg-neutral-800"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
