"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Badge } from "../badge";

// TODO: Replace with actual data fetching
const mockMenuItems = [
  {
    id: "1",
    title: "Paulaner Hell",
    description: "4.9% ABV 20 IBU",
    price: 10.0,
    oldPrice: null,
    isOnSale: false,
    isActive: true,
    isAvailable: true,
    categoryName: "Light Beer",
    order: 1,
  },
  {
    id: "2",
    title: "Agara Wild Brewer",
    description: "4.9% ABV 27 IBU",
    price: 8.0,
    oldPrice: 10.0,
    isOnSale: true,
    isActive: true,
    isAvailable: true,
    categoryName: "Light Beer",
    order: 2,
  },
  {
    id: "3",
    title: "Bernard Dark",
    description: "5% ABV 24 IBU",
    price: 11.0,
    oldPrice: null,
    isOnSale: false,
    isActive: true,
    isAvailable: false,
    categoryName: "Dark Beer",
    order: 1,
  },
];

export function MenuItemsList() {
  const handleToggleActive = (id: string) => {
    // TODO: Implement toggle active status
    console.log("Toggle active for item:", id);
  };

  const handleToggleAvailable = (id: string) => {
    // TODO: Implement toggle availability
    console.log("Toggle availability for item:", id);
  };

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log("Edit item:", id);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log("Delete item:", id);
  };

  return (
    <Card className="bg-transparent border-neutral-800">
      <CardHeader>
        <CardTitle className="text-white">Menu Items List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockMenuItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-between p-4 py-2 bg-transparent border rounded-lg md:py-0 md:flex-row border-neutral-800"
            >
              <div className="flex-1">
                <div className="flex flex-col items-center gap-2 mb-1 sm:flex-row">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-neutral-600 text-neutral-400"
                    >
                      {item.categoryName}
                    </Badge>
                    {item.isOnSale && <Badge variant="destructive">Sale</Badge>}
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
                {item.description && (
                  <p className="mb-2 text-sm text-neutral-400">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  {item.isOnSale && item.oldPrice ? (
                    <>
                      <span className="text-lg font-bold text-green-400">
                        {item.price}
                      </span>
                      <span className="text-sm line-through text-neutral-600">
                        {item.oldPrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-white">
                      {item.price}
                    </span>
                  )}
                  <span className="text-xs text-neutral-600">
                    • Order: {item.order}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
