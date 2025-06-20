import { LoginForm } from "@/components/auth/login-form";


export default function LoginPage() {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full">
			<h1 className="pb-8 text-4xl font-semibold md:pb-12 sm:text-6xl md:text-7xl xl:text-8xl 2xl:text-9xl">
				Welcome back!
			</h1>
			
			<LoginForm />

		</div>
 )
}