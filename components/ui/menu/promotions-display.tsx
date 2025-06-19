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
      className={`space-y-2 bg-transparent  md:space-y-4 transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-60 translate-y-4'
      }`}
    >
        <h3 className="pb-2 pl-4 text-3xl font-bold text-white sm:pb-4 md:pb-4 sm:text-4xl xl:text-5xl">Promotions</h3>


        <div className="">
          {promotions.map((promotion, index) => (
            <div
              key={promotion.id}
              className={`pl-4 pb-8 bg-transparent transition-all duration-500 ease-out border-l-2  ${
                isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-60 translate-x-2'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms', borderLeftColor: '#f7f959'
              }}
            >
							{/* TITLE */}
              <h3 className="text-lg text-white md:text-xl">{promotion.title}</h3>
              <p className="text-sm text-neutral-400">
                {promotion.description}
              </p>

            </div>
          ))}
        </div>
    </div>
  );
}
