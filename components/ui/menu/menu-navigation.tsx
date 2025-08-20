'use client'

interface Category {
  id: string;
  name: string;
  description: string | null;
  order: number;
  items: any[];
}

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
}

interface MenuNavigationProps {
  categories: Category[];
  promotions: Promotion[];
}

export function MenuNavigation({ categories, promotions }: MenuNavigationProps) {
  const visibleCategories = categories.filter((c) => c.items && c.items.length > 0);

  return (
    <div className="w-full p-4 bg-transparent rounded-lg opacity-0 animate-fade-in animation-delay-1000">
      {/* <h2 className="pb-2 mb-4 text-lg font-semibold text-white border-b border-dashed border-neutral- ">
        Quick Navigation
      </h2> */}
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {/* Category navigation links */}
        {visibleCategories.map((category) => (
          <a
            key={category.id}
            href={`#category-${category.id}`}
            className="block p-3 text-sm text-left text-white no-underline transition-all duration-200 bg-transparent border rounded-lg group border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neutral-500 active:scale-95"
          >
            <div className="font-medium truncate transition-colors group-hover:text-green-400">
              {category.name}
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              {category.items.length} item{category.items.length !== 1 ? 's' : ''}
            </div>
          </a>
        ))}
        
        {/* Promotions navigation link */}
        {promotions.length > 0 && (
          <a
            href="#promotions-section"
            className="block p-3 text-sm text-left text-white no-underline transition-all duration-200 bg-transparent border-2 border-yellow-600 rounded-lg group hover:bg-yellow-900 hover:bg-opacity-20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 active:scale-95"
          >
            <div className="font-medium truncate transition-colors group-hover:text-yellow-300">
              🎉 Promotions
            </div>
            <div className="mt-1 text-xs text-yellow-400">
              {promotions.length} offer{promotions.length !== 1 ? 's' : ''}
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
