"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPromotion } from "@/actions/dashboard";
import { useState, useTransition } from "react";
import { useDashboard } from "@/context/dashboard-context";
import { toast } from "sonner";

export function PromotionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const { refreshPromotions } = useDashboard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    startTransition(async () => {
      const result = await createPromotion(formData);
      if (result.success) {
        // Reset form
        setTitle("");
        setDescription("");
        // Refresh promotions in context
        await refreshPromotions();
        toast.success("Promotion created successfully!");
      } else {
        console.error("Error creating promotion:", result.error);
        toast.error("Failed to create promotion");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-white">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g.: Happy Hours"
          required
          className="text-white bg-neutral-950 border-neutral-800 placeholder:text-neutral-500"
        />
      </div>
      
      <div>
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed promotion description, terms, time of validity, etc."
          rows={4}
          className="text-white bg-neutral-950 border-neutral-800 placeholder:text-neutral-500"
        />
      </div>
      
      <Button type="submit" disabled={isPending} className="text-white bg-neutral-800 hover:bg-neutral-700 border-neutral-600">
        {isPending ? "Creating..." : "Create Promotion"}
      </Button>
    </form>
  );
}
