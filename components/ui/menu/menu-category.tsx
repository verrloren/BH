"use client";

import { Badge } from "@/components/ui/badge";
import { MenuCategoryProps } from "@/types/types";



export function MenuCategory({ category }: MenuCategoryProps) {
  return (
    <div style={{ borderLeftColor: '#84da8a' }} className="space-y-2 bg-transparent border-l-2 md:space-y-4">

				{/* CATEGORY */}
        <h3 className="pb-2 pl-4 text-3xl font-bold text-white" >
					{category.name}
					</h3>
        {category.description && (
          <p className="text-sm text-neutral-400">{category.description}</p>
        )}

				{/* ITEMS */}
        <div className="flex flex-col items-start w-full pl-4 space-y-1 sm:space-y-4">
          {category.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between w-full bg-transparent "
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:pb-1">
									{/* TITLE */}
                  <h3 className="text-lg text-white md:text-xl">{item.title}</h3>
                  {item.isOnSale && (
                    <Badge variant="destructive">Sale</Badge>
                  )}
                </div>
								{/* DESCRIPTION */}
                {item.description && (
                  <p className="mb-2 text-sm text-neutral-400">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end ml-4">
                {item.isOnSale && item.oldPrice ? (
                  <div className="flex items-center gap-x-4">
                    <span  className="text-lg text-[#d3524c]">
                      {item.oldPrice}
                    </span>
                    <span className="text-lg font-bold text-green-400">
                      {item.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-white">
                    {item.price}
                  </span>
                )}
              </div>
            </div>
          ))}
          {category.items.length === 0 && (
            <p className="text-center text-neutral-500">No items available in this category</p>
          )}
        </div>
    </div>
  );
}
