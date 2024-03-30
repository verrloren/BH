"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"
import CustomLink from "../custom-link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu"
import React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';

export function MainNav() {
	
	const router = useRouter(); 
	
	return (
    <div className="flex gap-4 items-center">
          <Button onClick={() => router.push('/')} variant="ghost">
						<Image
							src="/images/logoRemove.png"
							alt="Home"
							width="100"
							height="50"
						/>
					</Button>
      
    </div>
  )
}


// const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//             className
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium leading-none">{title}</div>
//           <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   )
// })
// ListItem.displayName = "ListItem"
