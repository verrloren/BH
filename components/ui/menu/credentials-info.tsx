'use client'

import { Instagram, InstagramIcon, LucideInstagram, Phone } from "lucide-react"

export function CredentialsInfo() {
	return (
		<div className="flex flex-row items-start justify-between">
			<div className="flex items-center gap-x-2">
				<Phone size={14} className=" text-neutral-600" />
				<p className="text-sm text-neutral-600">+995 551 721 313</p>
			</div>

			<div className="flex items-center mb-4 gap-x-2">
				<LucideInstagram size={14} className="text-neutral-600" />
				<a href="https://www.instagram.com/beerhousebatumi" className="text-sm cursor-pointer text-neutral-600">beerhousebatumi</a>
			</div>
		</div>
	)
}
