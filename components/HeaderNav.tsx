"use client";
import { LuArrowLeft } from "react-icons/lu";
import { LuMoreVertical } from "react-icons/lu";
import ProfileDropdown from "./ProfileDropdown";
import { Button } from "./ui/button";
import type { User as PrismaUser } from "@prisma/client";
import { ActionResult } from "@/lib/utils/types";
import Link from "next/link";
import { BackArrow } from "./BackArrow";

export default function HeaderNav({
	loggedInUserId,
}: {
	loggedInUserId: string | undefined;
}) {
	return (
		<header className='flex w-full justify-between px-3 py-3 items-center'>
			<BackArrow variant='button' />

			<p className=' w-auto font-medium size-4'>Profile</p>
			<ProfileDropdown loggedInUserId={loggedInUserId} />
		</header>
	);
}
