import { prisma } from "@/lib/db";
import MeetForm from "./meet";
import { protectPage } from "@/lib/auth";
import { fetchAddress } from "@/lib/utils/fetchAddress";

export default async function CreateMeet({
  searchParams,
}: {
  searchParams: { location?: string, venueId?: string };
}) {

  const user = await protectPage();

  const activityTypes = await prisma.activityType.findMany();

  if (searchParams.location) {
    // Location was given in url query
    const locationArray = JSON.parse(searchParams.location);
    const address = await fetchAddress(locationArray[0], locationArray[1]);
    return (
      <div>
        <MeetForm
          userId={user.id}
          location={locationArray}
          address={address}
          activityTypes={activityTypes}
        />
      </div>
    );
  } else if (searchParams.venueId) {
    // Called with venueId
    const venue = await prisma.venue.findUnique({
      where: {
        id: searchParams.venueId,
      },
    });
    if (venue) {
      const address = venue.address ? venue.address : undefined
      return (
        <div>
          <MeetForm
            userId={user.id}
            venueId={venue.id}
            venueName={venue.name}
            address={address}
            activityTypes={activityTypes}
          />
        </div>
      );
    }
  }
  

 
}
