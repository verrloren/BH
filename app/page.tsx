import Container from "@/components/container";
import { Logo } from "@/components/logo";
import { MenuCategory } from "@/components/ui/menu/menu-category";
import { PromotionsDisplay } from "@/components/ui/menu/promotions-display";
import { getPublicCategories, getPublicPromotions } from "@/actions/menu";
import { CredentialsInfo } from "@/components/ui/menu/credentials-info";
import { DescriptionInfo } from "@/components/ui/menu/description-info";
import { MenuNavigation } from "@/components/ui/menu/menu-navigation";

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';

export default async function Index() {
  const [categories, promotions] = await Promise.all([
    getPublicCategories(),
    getPublicPromotions(),
  ]);

  return (
    <Container>
      <div className="opacity-0 animate-fade-in animation-delay-500">
        <CredentialsInfo />
      </div>
				<Logo />
      <div className="pt-4 space-y-4">
        <h1 className="flex items-center lg:hidden justify-center font-bold text-center text-white opacity-0 animate-fade-in animation-delay-700 text-8xl sm:text-[180px] md:text-[200px] xl:text-[220px]">
          Menu
        </h1>

        <MenuNavigation categories={categories} promotions={promotions} />

        <div className="flex flex-col w-full pt-4 opacity-0 animate-fade-in animation-delay-1000 gap-y-8">
          {/* <DescriptionInfo /> */}

          {/* Menu categories */}
          <div className="grid pt-2 md:gap-x-16 xl:gap-x-24 gap-y-12 md:grid-cols-2">
            {categories.map((category) => (
              <div key={category.id} id={`category-${category.id}`}>
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
