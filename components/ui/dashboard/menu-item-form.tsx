"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createMenuItem } from "@/actions/dashboard";
import { useState, useTransition } from "react";
import { useDashboard } from "@/context/dashboard-context";
import { toast } from "sonner";

export function MenuItemForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [isOnSale, setIsOnSale] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [order, setOrder] = useState(0);
    const [isPending, startTransition] = useTransition();
    const { categories, refreshMenuItems } = useDashboard();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("oldPrice", oldPrice);
        formData.append("isOnSale", isOnSale.toString());
        formData.append("categoryId", categoryId);
        formData.append("order", order.toString());

        startTransition(async () => {
            const result = await createMenuItem(formData);
            if (result.success) {
                // Reset form
                setTitle("");
                setDescription("");
                setPrice("");
                setOldPrice("");
                setIsOnSale(false);
                setCategoryId("");
                setOrder(0);
                // Refresh menu items in context
                await refreshMenuItems();
                toast.success("Menu item created successfully!");
            } else {
                console.error("Error creating menu item:", result.error);
                toast.error("Failed to create menu item");
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
                    placeholder="E.g.: Paulaner Hell"
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
                    placeholder="4.9% ABV 20 IBU"
                    className="text-white bg-neutral-950 border-neutral-800 placeholder:text-neutral-500"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="price" className="text-white">Price</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="10.00"
                        required
                        className="text-white bg-neutral-950 parent border-neutral-800 placeholder:text-neutral-500"
                    />
                </div>
                
                <div>
                    <Label htmlFor="order" className="text-white">Order</Label>
                    <Input
                        id="order"
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                        className="text-white bg-neutral-950 border-neutral-800"
                    />
                </div>
            </div>
            
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isOnSale"
                    checked={isOnSale}
                    onCheckedChange={(checked) => setIsOnSale(checked === true)}
                    className="border-neutral-600 data-[state=checked]:bg-neutral-600"
                />
                <Label htmlFor="isOnSale" className="text-white">Sale</Label>
            </div>
            
            {isOnSale && (
                <div>
                    <Label htmlFor="oldPrice" className="text-white">Old Price</Label>
                    <Input
                        id="oldPrice"
                        type="number"
                        step="0.01"
                        value={oldPrice}
                        onChange={(e) => setOldPrice(e.target.value)}
                        placeholder="15.00"
                        className="text-white bg-neutral-950 border-neutral-600 placeholder:text-neutral-500"
                    />
                </div>
            )}
            
            <div>
                <Label htmlFor="category" className="text-white">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="text-white bg-neutral-950 border-neutral-800">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-600">
                        {categories.map((category) => (
                            <SelectItem 
                                key={category.id} 
                                value={category.id} 
                                className="text-white hover:bg-neutral-800"
                            >
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <Button type="submit" disabled={isPending} className="text-white bg-neutral-800 hover:bg-neutral-700 border-neutral-600">
                {isPending ? "Adding..." : "Add Item"}
            </Button>
        </form>
    );
}