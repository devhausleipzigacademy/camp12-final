import { prisma } from "@/lib/db";
import Link from "next/link";
import CreateVenueForm from "./create-venue-form";
import { fetchAddress } from "@/lib/utils/fetchAddress";

export default async function CreateVenuePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] };
}) {
  const activityTypes = await prisma.activityType.findMany();

  const tags = await prisma.tag.findMany();

  console.log(tags);

  const locationString = searchParams.location as string;

  const location: number[] = locationString
    .replace(/[\[\]]/g, "") // Remove square brackets
    .split(",") // Split into array
    .map(Number); // Convert each item to a number
  console.log(location);


  const address = await fetchAddress(location[0], location[1]);

  return (
    <div className="m-4">
      <Link href="/" className="text-2xl ml-2">
        ←
      </Link>
      <section className="flex flex-col items-center gap-3">
        <h1 className="text-2xl font-bold">Add a venue</h1>
        <div>
          <ul className="text-center">{
          address.split(",").map((item: string) =>
          <span className="pb-6">{item}<br /></span>
          )}
          </ul>
        </div>
      </section>
      <section className="flex flex-col ">
        <CreateVenueForm
          activityTypes={activityTypes}
          location={location}
          tags={tags}
          address={address}
        />
      </section>
    </div>
  );
}
