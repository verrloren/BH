import { auth, signOut } from "@/auth";
import Container from "@/components/container";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOutIcon } from "lucide-react";
import { CategoryForm } from "@/components/ui/dashboard/category-form";
import { MenuItemForm } from "@/components/ui/dashboard/menu-item-form";
import { PromotionForm } from "@/components/ui/dashboard/promotion-form";
import { CategoriesList } from "@/components/ui/dashboard/categories-list";
import { MenuItemsList } from "@/components/ui/dashboard/menu-items-list-new";
import { PromotionsList } from "@/components/ui/dashboard/promotions-list-new";
import { DashboardProvider } from "@/context/dashboard-context";

const DashboardPage = async () => {

	const session = await auth();

	return (
	<DashboardProvider>
		<Container>

		<form 
			className="flex items-center justify-between w-full "
		action={async () => {
			//that's how we use signOut in server components, server actions etc
			"use server";
			await signOut();
		}}>
			<Logo />

			<Button className="w-12 h-12 bg-transparent border rounded-full border-neutral-800"type="submit">
				<LogOutIcon size={24} className="w-12 h-12 text-center" />
			</Button>
		</form>

		<Tabs defaultValue="categories" className="w-full pt-4 md:pt-8">
                <TabsList className="grid w-full grid-cols-3 bg-transparent border-neutral-800">
                    <TabsTrigger value="categories" className="text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-neutral-800">Categories</TabsTrigger>
                    <TabsTrigger value="items" className="text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-neutral-800">Items</TabsTrigger>
                    <TabsTrigger value="promotions" className="text-neutral-400 data-[state=active]:text-white data-[state=active]:bg-neutral-800">Promotions</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-6">
                    <Card className="bg-transparent border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white">Add Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CategoryForm />
                        </CardContent>
                    </Card>
                    <CategoriesList />
                </TabsContent>

                <TabsContent value="items" className="space-y-6">
                    <Card className="bg-transparent border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white">Add Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MenuItemForm />
                        </CardContent>
                    </Card>
                    <MenuItemsList />
                </TabsContent>

                <TabsContent value="promotions" className="space-y-6">
                    <Card className="bg-transparent border-neutral-800">
                        <CardHeader>
                            <CardTitle className="text-white">Add Promotion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PromotionForm />
                        </CardContent>
                    </Card>
                    <PromotionsList />
                </TabsContent>
            </Tabs>

		</Container>
	</DashboardProvider>
	)
};

export default DashboardPage;
