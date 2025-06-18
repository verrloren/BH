import Container from "@/components/container"
import { Logo } from "@/components/logo"
import { MenuCategory } from "@/components/ui/menu/menu-category"
import { PromotionsDisplay } from "@/components/ui/menu/promotions-display"
import { getPublicCategories, getPublicPromotions } from "@/actions/menu"
import { CredentialsInfo } from "@/components/ui/menu/credentials-info"
import { DescriptionInfo } from "@/components/ui/menu/description-info"

export default async function Index() {
  const [categories, promotions] = await Promise.all([
    getPublicCategories(),
    getPublicPromotions()
  ]);

  return (
    <Container>
        <CredentialsInfo />
        <Logo />
      <div className="pt-4 space-y-8">
      <h1 className="flex items-center justify-center font-bold text-center text-white text-8xl sm:text-5xl md:text-6xl lg:text-7xl">
        Menu
      </h1>



				{/* <DescriptionInfo /> */}

        
        {/* Menu categories */}
        <div className="grid grid-rows-1 pt-6 gap-y-8 md:gap-x-24 md:grid-flow-row md:grid-cols-2">
          {categories.map((category) => (
            <MenuCategory key={category.id} category={category} />
          ))}
        </div>
        
        {categories.length === 0 && (
          <div className="text-center text-neutral-500">
            <p>No menu items available at the moment.</p>
          </div>
        )}

        <PromotionsDisplay promotions={promotions} />

      </div>

    </Container>
  )
}
