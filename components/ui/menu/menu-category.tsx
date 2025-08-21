"use client";

import { Badge } from "@/components/ui/badge";
import { MenuCategoryProps } from "@/types/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function MenuCategory({ category }: MenuCategoryProps) {
  const { ref, isVisible } = useScrollAnimation();

  // Hide empty categories
  if (!category.items || category.items.length === 0) return null;

  return (
    <div 
      ref={ref}
      className={`1py-2 bg-transparent md:space-y-4 transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ borderLeftColor: '#84da8a' }}
    >

				{/* CATEGORY */}
        <h3 className="py-3 pl-4 text-3xl font-bold text-white sm:pb-4 md:pb-4 sm:text-4xl xl:text-5xl" >
					{category.name}
					</h3>
        {category.description && (
          <p className="text-sm text-neutral-400">{category.description}</p>
        )}

				{/* ITEMS */}
        <div className="flex flex-col items-start w-full py-1 pl-4 space-y-1 border-l-2 sm:space-y-4" style={{ borderLeftColor: '#84da8a' }}>
          {category.items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between w-full bg-transparent transition-all duration-500 ease-out border-b border-dashed border-neutral-800 last:border-b-0 ${
                isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-4'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${(index + 1) * 25}ms` : '0ms' 
              }}
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
                    <span  className="text-lg text-[#d3524c] line-through">
                      {item.oldPrice}
                    </span>
                    <span className="text-lg font-bold text-green-400">
                      {item.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-white">
                    {String(item.price)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
