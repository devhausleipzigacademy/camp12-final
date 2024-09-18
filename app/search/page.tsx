import { BackArrow } from "@/components/BackArrow";
import Search from "@/components/Search";
import { prisma } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SearchPage = async ({
	searchParams,
}: {
	searchParams: { q: string };
}) => {
	console.log("Search Params", searchParams.q);

	const searchQuery = searchParams.q || "";

	const venues = await prisma.venue.findMany({
		where: {
			OR: [
				{ name: { contains: searchQuery, mode: "insensitive" } },
				{ address: { contains: searchQuery, mode: "insensitive" } },
				{
					activityTypes: {
						some: {
							name: { contains: searchQuery, mode: "insensitive" },
						},
					},
				},
				{
					tags: {
						some: {
							name: { contains: searchQuery, mode: "insensitive" },
						},
					},
				},
			],
		},
		include: { activityTypes: true, tags: true },
		take: 5,
	});

	const meets = await prisma.meet.findMany({
		where: {
			OR: [
				{ notes: { contains: searchQuery, mode: "insensitive" } },
				{
					activityType: {
						name: { contains: searchQuery, mode: "insensitive" },
					},
				},
				{
					tags: {
						some: {
							name: { contains: searchQuery, mode: "insensitive" },
						},
					},
				},
			],
		},
		include: { activityType: true, tags: true },
		take: 10,
	});

	return (
		<div className='container mx-auto p-4'>
			<BackArrow variant='link' />
			<h1 className='text-2xl font-bold mb-4'>
				Search results for: {searchQuery}
			</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Venues</h2>
        {venues.length > 0 ? (
          <ul className="space-y-2">
            {venues.map((venue) => (
              <li key={venue.id} className="border p-2 rounded">
                <a href={`venue-detail/${venue.id}`}>
                  <p className="font-medium text-lg">{venue.name}</p>
                  <p className="text-sm text-zinc-500">{venue.address}</p>
                  <p className="text-sm text-zinc-500">
                    Activities:{" "}
                    {venue.activityTypes.map((at) => at.name).join(", ")}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {venue.tags.map((tag) => (
                      <span
                        key={tag.name}
                        className="text-xs text-zinc-500 bg-zinc-100 border rounded-full px-2 py-1"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Venues found</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Meets</h2>
        {meets.length > 0 ? (
          <ul className="space-y-2">
            {meets.map((meet) => (
              <li key={meet.id} className="border p-2 rounded">
                <a href={`meet/${meet.id}`}>
                  <p className="font-medium text-lg">
                    {meet.activityType.name}
                  </p>
                  <p className="text-sm text-zinc-500">{meet.notes}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {meet.tags.map((tag) => (
                      <span
                        key={tag.name}
                        className="text-xs text-zinc-500 bg-zinc-100 border rounded-full px-2 py-1"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Meets found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
