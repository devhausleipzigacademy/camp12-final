import { prisma } from "@/lib/db";
import CreateMeet from "./meet";
import { protectPage } from "@/lib/auth";

// for now the venue is optional until the routing is fixed

export default async function UpdateMeet() {
  // user has to be logged in to be able to create a session
  const user = await protectPage();
  // fetching tags from db
  const tags = await prisma.tag.findMany();
  // venue is hard coded, when routing is fixed, we can get the location/venue from params
  // this has to be read from params when connected to the map
  let venue = null;
  try {
    venue = await prisma.venue.findUnique({
      where: { name: "Weisse Elster" },
    });
  } catch (error) {
    console.log(error);
  }
  return (
    <div>
      {venue ? (
        <CreateMeet
          isPublic={false}
          creatorId={user.id}
          guests={0}
          venueId={venue.id}
          venueName={venue.name}
          tagSuggestions={tags}
        />
      ) : (
        <div>Venue not found</div>
      )}
    </div>
  );
}
