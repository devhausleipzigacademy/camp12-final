"use client";
import ProfileDropdown from "./ProfileDropdown";
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
