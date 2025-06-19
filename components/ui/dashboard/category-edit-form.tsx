"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateCategory } from "@/actions/dashboard";
import { useState, useTransition } from "react";
import { useDashboard } from "@/context/dashboard-context";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  itemCount: number;
}

interface CategoryEditFormProps {
  category: Category;
  onCancel: () => void;
  onSave: () => void;
}

export function CategoryEditForm({ category, onCancel, onSave }: CategoryEditFormProps) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  const [order, setOrder] = useState(category.order);
  const [isPending, startTransition] = useTransition();
  const { refreshCategories } = useDashboard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("id", category.id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("order", order.toString());

    startTransition(async () => {
      const result = await updateCategory(formData);
      if (result.success) {
        await refreshCategories();
        toast.success("Category updated successfully!");
        onSave();
      } else {
        console.error("Error updating category:", result.error);
        toast.error("Failed to update category");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 border rounded-lg bg-neutral-900 border-neutral-700">
      <h3 className="text-lg font-semibold text-white">Edit Category</h3>
      
      <div>
        <Label htmlFor="edit-name" className="text-white">Category Name</Label>
        <Input
          id="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g.: Light Beer"
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
          placeholder="Brief category description"
          className="text-white bg-neutral-950 border-neutral-800 placeholder:text-neutral-500"
        />
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
