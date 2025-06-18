import "./globals.css"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Toaster } from "sonner"

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
	
export const metadata: Metadata = {
	title: "Beer House Menu",
	description:
		"Beer House Menu",
}
export default function RootLayout({ children }: React.PropsWithChildren) {
	return (
		<html lang="en">
			<body className={poppins.className}>
					<div className="w-full">
						<main className="">
							{children}
						</main>
					</div>
					<Toaster 
						theme="dark" 
						position="top-right"
						expand={false}
						richColors
					/>
			</body>
		</html>
	)
}
