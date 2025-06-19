"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Badge } from "../badge";
import { toggleCategoryActive, deleteCategory } from "@/actions/dashboard";
import { useTransition } from "react";
import { useDashboard } from "@/context/dashboard-context";
import { toast } from "sonner";

export function CategoriesList() {
  const { categories, refreshCategories } = useDashboard();
  const [isPending, startTransition] = useTransition();

  const handleToggleActive = (id: string) => {
    startTransition(async () => {
      const result = await toggleCategoryActive(id);
      if (result.success) {
        await refreshCategories();
        toast.success("Category status updated!");
      } else {
        toast.error("Failed to update category status");
      }
    });
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log("Edit category:", id);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        await refreshCategories();
        toast.success("Category deleted successfully!");
      } else {
        toast.error("Failed to delete category");
      }
    });
  };

  return (
    <Card className="bg-transparent border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Categories List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center justify-between p-4 py-2 bg-transparent border rounded-lg md:py-0 sm:flex-row border-neutral-800"
            >
              <div className="flex-1 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{category.name}</h3>

                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className="border-neutral-600 text-neutral-400">
                    {category.itemCount} items
                  </Badge>
                </div>
                {category.description && (
                  <p className="text-sm text-neutral-400">
                    {category.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-600">
                  Order: {category.order}
                </p>
              </div>
              <div className="flex items-center gap-4 pt-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(category.id)}
                  className="bg-transparent border-neutral-800 text-neutral-400 hover:brightness-110"
                >
                  {category.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category.id)}
                  className="bg-transparent border-neutral-800 text-neutral-400 hover:brightness-110"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="bg-transparent border-neutral-800 text-neutral-400 hover:brightness-110"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
