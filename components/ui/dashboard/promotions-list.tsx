"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Badge } from "../badge";

// TODO: Replace with actual data fetching
const mockPromotions = [
  {
    id: "1",
    title: "Happy Hours",
    description: "20% discount on all beer from 5:00 PM to 7:00 PM every day",
    isActive: true,
    createdAt: new Date("2024-01-15")
  },
  {
    id: "2",
    title: "Set of 6 Tinctures",
    description: "Try 6 different tinctures for 30 lari instead of 36",
    isActive: true,
    createdAt: new Date("2024-01-10")
  },
  {
    id: "3",
    title: "Shot for Review",
    description: "Leave a review on Google Maps and get a free tincture shot",
    isActive: false,
    createdAt: new Date("2024-01-05")
  }
];

export function PromotionsList() {
  const handleToggleActive = (id: string) => {
    // TODO: Implement toggle active status
    console.log("Toggle active for promotion:", id);
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log("Edit promotion:", id);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log("Delete promotion:", id);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Card className="bg-transparent border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Promotions List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPromotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex flex-col items-start justify-between p-4 py-2 bg-transparent border rounded-lg md:py-0 md:flex-row border-neutral-800"
            >
              <div className="flex-1">
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
              <div className="flex items-center gap-2 ml-4">
                <Button
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
                  size="sm"
                  onClick={() => handleEdit(promotion.id)}
                  className="bg-transparent border-neutral-800 text-neutral-400 hover:brightness-110"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDelete(promotion.id)}
                  className="bg-tranparent border-neutral-800 text-neutral-400 hover:brightness-110"
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
