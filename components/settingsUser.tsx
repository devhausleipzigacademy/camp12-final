"use client";

import { useState } from "react";
import { updateSettings } from "@/actions/settings";
import { Settings } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BackArrow } from "./BackArrow";

type Props = {
  userId: string;
  settings: Settings;
};

export default function SettingsUser({ userId, settings }: Props) {
  // State to hold the selected options for both settings categories
  const [friendsListSetting, setFriendsListSetting] = useState(
    settings.friendsVisibility
  );
  const [profileSetting, setProfileSetting] = useState(
    settings.profileVisibility
  );
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event?.preventDefault;
    await updateSettings({
      friendsVisible: friendsListSetting,
      profileVisible: profileSetting,
      userId,
    });
    toast("Settings updated");
    router.push("/profile");
  };

  return (
		<div>
			<div className='w-full fixed m-6 flex align-text-top '>
				<BackArrow variant='link' />
			</div>
			<div className='min-h-screen flex flex-col items-center justify-between bg-white px-8 py-28 g-10'>
				<div className='w-full flex items-center mb-8'>
					<h1 className='flex-1 text-center text-2xl font-bold'>Settings</h1>
				</div>
				{/* Friends List setting */}
				<div className='w-full max-w-sm mb-6'>
					<h2 className='text-lg font-semibold mb-4'>Friends list</h2>
					<div className='flex flex-col space-y-2'>
						<label className='flex items-center'>
							<input
								type='radio'
								name='friendsList'
								value='Private'
								checked={friendsListSetting === "Private"}
								onChange={() => setFriendsListSetting("Private")}
								className='mr-2'
							/>
							Private
						</label>
						<label className='flex items-center'>
							<input
								type='radio'
								name='friendsList'
								value='Only friends'
								checked={friendsListSetting === "FriendsOnly"}
								onChange={() => setFriendsListSetting("FriendsOnly")}
								className='mr-2'
							/>
							Only friends
						</label>
						<label className='flex items-center'>
							<input
								type='radio'
								name='friendsList'
								value='Public'
								checked={friendsListSetting === "Public"}
								onChange={() => setFriendsListSetting("Public")}
								className='mr-2'
							/>
							Public
						</label>
					</div>
				</div>
				{/* Profile setting */}
				<div className='w-full max-w-sm mb-6'>
					<h2 className='text-lg font-semibold mb-4'>Profile</h2>
					<div className='flex flex-col space-y-2'>
						<label className='flex items-center'>
							<input
								type='radio'
								name='profile'
								value='Private'
								checked={profileSetting === "Private"}
								onChange={() => setProfileSetting("Private")}
								className='mr-2'
							/>
							Private
						</label>
						<label className='flex items-center'>
							<input
								type='radio'
								name='profile'
								value='Only friends'
								checked={profileSetting === "FriendsOnly"}
								onChange={() => setProfileSetting("FriendsOnly")}
								className='mr-2'
							/>
							Only friends
						</label>
						<label className='flex items-center'>
							<input
								type='radio'
								name='profile'
								value='Public'
								checked={profileSetting === "Public"}
								onChange={() => setProfileSetting("Public")}
								className='mr-2'
							/>
							Public
						</label>
					</div>
				</div>
				{/* Save settings button */}
				<button
					onClick={handleSubmit}
					className='bg-black text-white font-bold py-2 px-6 rounded-full'
				>
					Save settings
				</button>
			</div>
		</div>
	);
}
