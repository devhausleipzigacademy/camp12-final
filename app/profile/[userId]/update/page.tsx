import React from "react";
import { ProfileForm } from "./ProfileForm";
import { protectPage } from "@/lib/auth";
import { BackArrow } from "@/components/BackArrow";

export default async function page() {
	const user = await protectPage();

	return (
		<div>
			<div className='w-full m-6'>
				<BackArrow variant='link' />
			</div>
			<ProfileForm user={user} />
		</div>
	);
}
