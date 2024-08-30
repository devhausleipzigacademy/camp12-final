import { FilterDrawer } from "@/components/FilterDrawer";
import { DrawerHomepage } from "@/components/DrawerHomepage";
import Navbar from "../components/Navbar";
import { Map } from "@/components/Map";
import { getVenues, GetVenuesResult } from "@/app/api/data-access/venues";

type Filters = {
  activity?: string;
  status?: string;
  competitive?: boolean;
  // tournament?: boolean;
  // recurring?: boolean;
};

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] };
}) {
  const venues = await getVenues();

  console.log(venues);

  const parseBoolean = (val: string) => (val === "true" ? true : false);

  const filters = {
    activity: searchParams.activity as string,
    status: searchParams.status as string,
    competitive: parseBoolean(searchParams.competitive as string),
  };
  // maaybe to add later:
  // const tournament = searchParams.tournament;
  // const recurring = searchParams.recurring;

  function filterVenues(
    venues: GetVenuesResult,
    filters: Filters
  ): GetVenuesResult {
    const now = new Date(2024, 9, 20, 11);

    return venues.filter((venue) => {
      if (filters.activity) {
        return venue.activityTypes.some(
          (at) => at.name.toLowerCase() === filters.activity?.toLowerCase()
        );
      }
      if (filters.status?.toLowerCase() === "free") {
        if (venue.meets.length === 0) return true;
        // here for when something is planned but already over or not soon happening if (venue.meets.some((meet)=> meet.date ))
        if (
          venue.meets.some((meet) => {
            const [hours, minutes] = meet.time.split(":").map(Number);
            const meetStart = new Date(meet.date);
            meetStart.setHours(hours, minutes, 0, 0);
            console.log(meetStart);
            meetStart <= now &&
              now <= new Date(meetStart.getTime() + meet.duration * 3600000);
          })
        ) {
          return false;
        }
        return true;
      }
      // do we need an occupied filter actually?
      if (filters.status?.toLowerCase() === "occupied") {
        if (
          venue.meets.some(
            const
            (meet) =>
              meet.date <= now &&
              now <= new Date(meet.date.getTime() + meet.duration * 3600000) &&
              meet.isPublic === false
          )
        )
          return false;
      }
      if (filters.status?.toLowerCase() === "join") {
        if (
          venue.meets.some(
            (meet) =>
              meet.date <= now &&
              now <= new Date(meet.date.getTime() + meet.duration * 3600000) &&
              meet.isPublic === true
          )
        )
          return false;
      }

      return true;
    });
  }

  const filteredVenues = filterVenues(venues, filters);
  return (
    <div className="h-screen w-full">
      <Map venues={filteredVenues} />
      <DrawerHomepage />
      <div className="absolute top-4 right-4 z-[1000]">
        {" "}
        <FilterDrawer />
      </div>

      <Navbar />
    </div>
  );
}
