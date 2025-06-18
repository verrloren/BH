'use client'

import Link from "next/link"
import { useRouter } from "next/navigation";

interface AuthFooterProps {
	text: string
	src: string
}

export function AuthFooter({ text, src }: AuthFooterProps) {
	const router = useRouter();
	return (
		<div 
			onClick={() => router.push(src)} 
			className="w-full h-20 bg-black  absolute bottom-0 left-0 
			border-t-[1px] border-neutral-700 flex justify-center items-center
			cursor-pointer hover:shadow-xl ">
			<Link
				className="text-sm transition-colors md:text-md text-neutral-500 hover:text-white"
				href="/auth/register">
				{text}
			</Link>
		</div>
	)
}
