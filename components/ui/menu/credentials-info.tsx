'use client'

import { Instagram, InstagramIcon, LucideInstagram, Phone } from "lucide-react"

export function CredentialsInfo() {
	return (
		<div className="flex flex-row items-start justify-between">
			<div className="flex items-center gap-x-2">
				<Phone size={18} className=" text-neutral-400" />
				<p className="text-sm md:text-md xl:text-xl text-neutral-400">+995 551 721 313</p>
			</div>

			<div className="flex items-center mb-4 gap-x-2">
				<LucideInstagram size={18} className="text-neutral-400" />
				<a href="https://www.instagram.com/beerhousebatumi" className="text-sm cursor-pointer md:text-md xl:text-xl text-neutral-400">beerhousebatumi</a>
			</div>
		</div>
	)
}
