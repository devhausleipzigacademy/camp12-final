import { prisma } from "@/lib/db";
import Link from "next/link";
import CreateVenueForm from "./create-venue-form";
import { BackArrow } from "@/components/BackArrow";

export default async function CreateVenuePage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] };
}) {
	const activityTypes = await prisma.activityType.findMany({});

	const locationString = searchParams.location as string;

	const location: number[] = locationString
		.replace(/[\[\]]/g, "") // Remove square brackets
		.split(",") // Split into array
		.map(Number); // Convert each item to a number
	console.log(location);

	return (
		<div>
			<div className='grid grid-cols-4 items-center w-full m-6'>
				<BackArrow variant='link' />
				<h2 className='text-xl font-bold pb-3 text-left col-span-3'>
					Add a Venue
				</h2>
			</div>
			<CreateVenueForm
				activityTypes={activityTypes}
				location={location}
			/>
		</div>
	);
}
