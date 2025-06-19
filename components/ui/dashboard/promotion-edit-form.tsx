"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePromotion } from "@/actions/dashboard";
import { useState, useTransition } from "react";
import { useDashboard } from "@/context/dashboard-context";
import { toast } from "sonner";

interface Promotion {
  id: string;
  title: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface PromotionEditFormProps {
  promotion: Promotion;
  onCancel: () => void;
  onSave: () => void;
}

export function PromotionEditForm({ promotion, onCancel, onSave }: PromotionEditFormProps) {
  const [title, setTitle] = useState(promotion.title);
  const [description, setDescription] = useState(promotion.description || "");
  const [isPending, startTransition] = useTransition();
  const { refreshPromotions } = useDashboard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("id", promotion.id);
    formData.append("title", title);
    formData.append("description", description);

    startTransition(async () => {
      const result = await updatePromotion(formData);
      if (result.success) {
        await refreshPromotions();
        toast.success("Promotion updated successfully!");
        onSave();
      } else {
        console.error("Error updating promotion:", result.error);
        toast.error("Failed to update promotion");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 border rounded-lg bg-neutral-900 border-neutral-700">
      <h3 className="text-lg font-semibold text-white">Edit Promotion</h3>
      
      <div>
        <Label htmlFor="edit-title" className="text-white">Promotion Title</Label>
        <Input
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g.: Happy Hour Special"
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
          placeholder="Brief promotion description"
          className="text-white bg-neutral-950 border-neutral-800 placeholder:text-neutral-500"
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
