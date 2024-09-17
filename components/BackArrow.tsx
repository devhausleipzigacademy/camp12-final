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
				"absolut flex pb-3 justify-self-start",
				variant === "button" ? "bg-white/80" : "bg-transparent"
			)}
			onClick={() => router.back()}
		>
			<ArrowLeft className='text-black size-6' />
		</button>
	);
}
