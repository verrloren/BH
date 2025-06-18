"use client";

import { PromotionsDisplayProps } from "@/types/types";



export function PromotionsDisplay({ promotions }: PromotionsDisplayProps) {
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
    <div style={{ borderLeftColor: '#f7f75e' }} className="space-y-2 bg-transparent border-l-2 md:space-y-4">
        <h3 className="pb-2 pl-4 text-3xl font-bold text-white">Promotions</h3>


        <div className="space-y-1 md:space-y-4">
          {promotions.map((promotion) => (
						
            <div
              key={promotion.id}
              className="pl-4 bg-transparent"
            >
							{/* TITLE */}
              <h3 className="mb-1 font-semibold text-white">{promotion.title}</h3>
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
