"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCategory } from "@/actions/dashboard";
import { useState, useTransition } from "react";
import { useDashboard } from "@/context/dashboard-context";
import { toast } from "sonner";

export function CategoryForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [order, setOrder] = useState(0);
    const [isPending, startTransition] = useTransition();
    const { refreshCategories } = useDashboard();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("order", order.toString());

        startTransition(async () => {
            const result = await createCategory(formData);
            if (result.success) {
                // Reset form
                setName("");
                setDescription("");
                setOrder(0);
                // Refresh categories in context
                await refreshCategories();
                toast.success("Category created successfully!");
            } else {
                console.error("Error creating category:", result.error);
                toast.error("Failed to create category");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name" className="text-white">Category Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g.: Light Beer"
                    required
                    className="text-white bg-neutral-950 border-neutral-800 placeholder:text-neutral-500"
                />
            </div>
            
            <div>
                <Label htmlFor="description" className="text-white">Description (optional)</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief category description"
                    className="text-white bg-neutral-950 border-neutral-800 placeholder:text-neutral-500"
                />
            </div>
            
            <div>
                <Label htmlFor="order" className="text-white">Sort Order</Label>
                <Input
                    id="order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                    min="0"
                    className="text-white bg-neutral-950 border-neutral-800"
                />
            </div>
            
            <Button type="submit" disabled={isPending} className="text-white bg-neutral-800 hover:bg-neutral-700 border-neutral-600">
                {isPending ? "Creating..." : "Create Category"}
            </Button>
        </form>
    );
}