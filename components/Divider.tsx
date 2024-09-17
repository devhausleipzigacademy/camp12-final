"use client";
import { LuMoreVertical } from "react-icons/lu";
import { BackArrow } from "./BackArrow";

export default function HeaderNav() {
	return (
		<header className='flex w-full justify-between p-5'>
			<BackArrow variant='link' />
			<p className=' w-auto font-medium size-4'>Profile</p>
			<LuMoreVertical className='size-5' />
		</header>
	);
}
