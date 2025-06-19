"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Badge } from "../badge";
import { togglePromotionActive, deletePromotion } from "@/actions/dashboard";
import { useTransition } from "react";
import { useDashboard } from "@/context/dashboard-context";
import { toast } from "sonner";

export function PromotionsList() {
  const { promotions, refreshPromotions, isLoading } = useDashboard();
  const [isPending, startTransition] = useTransition();

  const handleToggleActive = (id: string) => {
    startTransition(async () => {
      const result = await togglePromotionActive(id);
      if (result.success) {
        await refreshPromotions();
        toast.success("Promotion status updated!");
      } else {
        toast.error("Failed to update promotion status");
      }
    });
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log("Edit promotion:", id);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deletePromotion(id);
      if (result.success) {
        await refreshPromotions();
        toast.success("Promotion deleted successfully!");
      } else {
        toast.error("Failed to delete promotion");
      }
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-transparent border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Promotions List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Promotions List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex flex-col items-center justify-between p-4 py-2 bg-transparent border rounded-lg md:py-0 sm:flex-row border-neutral-800"
            >
              <div className="flex-1 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white">{promotion.title}</h3>
                  <Badge variant={promotion.isActive ? "default" : "secondary"}>
                    {promotion.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="mb-2 text-sm text-neutral-400">
                  {promotion.description}
                </p>
                <p className="text-xs text-neutral-600">
                  Created: {formatDate(promotion.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4 pt-4 md:pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(promotion.id)}
                  title={promotion.isActive ? "Deactivate" : "Activate"}
                  className="bg-transparent border-neutral-800 text-neutral-400 hover:brightness-110"
                >
                  {promotion.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(promotion.id)}
                  className="bg-transparent border-neutral-800 text-neutral-400 hover:brightness-110"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(promotion.id)}
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
