// pages/success.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { protectPage } from "@/lib/auth";

export async function SuccessPage() {
	const router = useRouter();
	const userId = (await protectPage()).id; // Retrieve user's ID data from Lucia

	// Redirect after 5 seconds
	useEffect(() => {
		if (userId) {
			const timer = setTimeout(() => {
				router.push(`/profile/${userId}/friends`); // Redirect to friends page
			}, 5000);

			return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
		}
	}, [router, userId]);

	if (!userId) {
		return <div>Loading...</div>; // Show a loading state if userId is not available yet
	}

	return (
		<div className='flex items-center justify-center h-screen bg-green-100'>
			<div className='bg-white p-10 rounded-lg shadow-lg text-center'>
				<h1 className='text-2xl font-bold mb-4 text-green-600'>
					Friend Added Successfully!
				</h1>
				<p className='text-gray-700'>Redirecting you to your friends list...</p>
			</div>
		</div>
	);
}
