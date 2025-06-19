"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function Logo() {
  const router = useRouter();
  return (
    <div className="w-full md:flex md:justify-center lg:flex lg:items-end lg:justify-between">
        <h1 className="lg:flex items-center hidden justify-center font-bold text-center text-white opacity-0 animate-fade-in animation-delay-700 text-8xl sm:text-[180px] md:text-[190px] xl:text-[220px]">
          Menu
        </h1>

      <div
        className="relative z-10 bg-center bg-cover rounded-lg opacity-0 cursor-pointer md:aspect-[25/18] min-h-80 sm:h-[500px] animate-fade-in-straight animation-delay-100"
        style={{ backgroundImage: "url('/images/logo.jpg')" }}
        onClick={() => router.push("/")}
      />
    </div>
  );
}
