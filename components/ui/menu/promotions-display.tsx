"use client";

import { PromotionsDisplayProps } from "@/types/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function PromotionsDisplay({ promotions }: PromotionsDisplayProps) {
  const { ref, isVisible } = useScrollAnimation();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div 
      ref={ref}
      className={`space-y-2 bg-transparent border-l-2 md:space-y-4 transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-60 translate-y-4'
      }`}
      style={{ borderLeftColor: '#f7f75e' }}
    >
        <h3 className="pb-2 pl-4 text-3xl font-bold text-white">Promotions</h3>


        <div className="space-y-1 md:space-y-4">
          {promotions.map((promotion, index) => (
            <div
              key={promotion.id}
              className={`pl-4 bg-transparent transition-all duration-500 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-60 translate-x-2'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms' 
              }}
            >
							{/* TITLE */}
              <h3 className="mb-1 text-lg text-white md:text-xl">{promotion.title}</h3>
              <p className="mb-2 text-sm text-neutral-400">
                {promotion.description}
              </p>
              <p className="text-xs text-neutral-600">
                Valid from: {formatDate(promotion.createdAt)}
              </p>
            </div>
          ))}
        </div>
    </div>
  );
}
