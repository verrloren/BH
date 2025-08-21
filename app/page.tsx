import Container from "@/components/container";
import { Logo } from "@/components/logo";
import { MenuCategory } from "@/components/ui/menu/menu-category";
import { PromotionsDisplay } from "@/components/ui/menu/promotions-display";
import { CredentialsInfo } from "@/components/ui/menu/credentials-info";
import { MenuNavigation } from "@/components/ui/menu/menu-navigation";
import { getCategories } from "@/actions/get-categories";
import { getProducts } from "@/actions/get-products";
import { getPromotions } from "@/actions/get-promotions";
import { Category } from "@/types/types";

export const dynamic = 'force-dynamic';

export default async function Index() {
  const [posterCategories, posterProducts, posterPromotions] = await Promise.all([
    getCategories(),
    getProducts(),
    getPromotions(),
  ]);

  const categories = posterCategories
    .map((cat: { id: any; name: any }) => {
      const items = posterProducts
        .filter((p: { categoryId: any }) => p.categoryId && p.categoryId === cat.id)
        .map((p: { id: any; title: any; price: any }) => ({
          id: p.id,
          title: p.title,
          description: null,
          price: p.price,
          oldPrice: null,
          image: null,
          isOnSale: false,
          order: 0,
        }));
      return {
        id: cat.id,
        name: cat.name,
        description: null,
        order: 0,
        items,
      };
    })
    .filter((cat: { items: string | any[] }) => cat.items.length > 0);

  // Use real promotions from Poster
  const promotions = posterPromotions;

  return (
    <Container>
      <div className="opacity-0 animate-fade-in animation-delay-500">
        <CredentialsInfo />
      </div>
      <Logo />
      <div className="pt-4 space-y-4">
        <MenuNavigation categories={categories} promotions={promotions} />

        <div className="flex flex-col w-full pt-4 opacity-0 animate-fade-in animation-delay-1000 gap-y-8 md:gap-y-12">
          <div className="pt-2 columns-1 md:columns-2 xl:columns-3 gap-x-6 md:gap-x-12">
            {categories.map((category: Category) => (
              <div
                key={category.id}
                id={`category-${category.id}`}
                className="mb-8 md:mb-10"
                style={{ breakInside: "avoid" }}
              >
                <MenuCategory category={category} />
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center text-neutral-500">
              <p>No menu items available at the moment.</p>
            </div>
          )}

          <div className="pt-4" id="promotions-section">
            <PromotionsDisplay promotions={promotions} />
          </div>
        </div>
      </div>
    </Container>
  );
}
