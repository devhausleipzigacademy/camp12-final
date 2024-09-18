"use client";
import { Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <Link href="/" className="block">
      <div className="flex w-11 h-11 rounded-xl absolute z-[999] top-4 left-4 p-3 bg-white/80 justify-between items-center cursor-pointer hover:bg-white/90 transition-colors">
        <Globe className="size-5" />
      </div>
    </Link>
  );
}
