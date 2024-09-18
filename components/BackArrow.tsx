"use client";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
	variant?: "button" | "link";
};

export function BackArrow({ variant = "button" }: Props) {
	const router = useRouter();

	return (
		<button
			className={cn(
				"rounded-lg p-2.5 w-full max-w-sm flex flex-col justify-between flex-grow",
				variant === "button" ? "bg-white/80" : "bg-transparent"
			)}
			onClick={() => router.back()}
		>
			<ArrowLeft className='text-black size-6' />
		</button>
	);
}
