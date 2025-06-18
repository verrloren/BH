"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function Logo() {
  const router = useRouter();
  return (
    // <h1
    // 	onClick={() => router.push('/')}
    // 	className="text-5xl font-bold cursor-pointer text-neutral-100 sm:text-5xl md:text-6xl lg:text-7xl"
    // >
    // 	Beer House
    // 	</h1>
    <div
      className="relative z-10 w-full h-64 bg-center bg-cover rounded-lg opacity-0 cursor-pointer sm:h-48 md:h-56 lg:h-64 animate-fade-in-straight animation-delay-100"
      style={{ backgroundImage: "url('/images/logo.jpg')" }}
      onClick={() => router.push("/")}
    >

      {/* <h1 className="absolute -bottom-[8px] flex items-center justify-center font-bold text-center text-white left-[14%] text-7xl sm:text-5xl md:text-6xl lg:text-7xl">
        Menu
      </h1> */}
    </div>
  );
}
