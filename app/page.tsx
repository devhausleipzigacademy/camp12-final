import { FilterDrawer } from "@/components/FilterDrawer";
import { DrawerHomepage } from "@/components/DrawerHomepage";
import Navbar from "../components/Navbar";
import { Map } from "@/components/Map";
import { getVenues, GetVenuesResult } from "@/app/api/data-access/venues";
import { Meet } from "@prisma/client";
import { log } from "console";

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
    const now = new Date(2024, 8, 20, 10);

    // Somhow the time is always to hours earlier in the backend but i don't know if thats relevant, it still works

    return venues.filter((venue) => {
      if (filters.activity) {
        return venue.activityTypes.some(
          (at) => at.name.toLowerCase() === filters.activity?.toLowerCase()
        );
      }
      function isMeetNow(meet: Meet) {
        const meetDate = new Date(meet.date);
        const [hours, minutes] = meet.time.split(":").map(Number);
        // const isSameDay =
        //   meet.date.getFullYear() === now.getFullYear() &&
        //   meet.date.getMonth() === now.getMonth() &&
        //   meet.date.getDate() === now.getDate();

        // if (!isSameDay) return false;

        const meetStart = new Date(meetDate);
        meetStart.setHours(hours, minutes, 0, 0);
        console.log("start", meetStart);

        const meetEnd = new Date(meetStart.getTime() + meet.duration * 3600000);
        console.log("end", meetEnd);
        console.log("now", now);

        return meetStart <= now && now <= meetEnd;
      }
      function isMeetPlanned(meet: Meet) {
        const meetDate = new Date(meet.date);
        const [hours, minutes] = meet.time.split(":").map(Number);
        const isSameDay =
          meet.date.getFullYear() === now.getFullYear() &&
          meet.date.getMonth() === now.getMonth() &&
          meet.date.getDate() === now.getDate();

        if (!isSameDay) return false;

        const meetStart = new Date(meetDate);
        meetStart.setHours(hours, minutes, 0, 0);
        console.log("start", meetStart);

        const meetEnd = new Date(meetStart.getTime() + meet.duration * 3600000);
        console.log("end", meetEnd);
        console.log("now", now);

        return now < meetStart;
      }

      if (filters.status?.toLowerCase() === "free") {
        if (venue.meets.length === 0) return true;
        return !venue.meets.some(isMeetNow);
      }

      // do we need an occupied filter actually?
      if (filters.status?.toLowerCase() === "occupied") {
        if (
          venue.meets.some(isMeetNow) &&
          venue.meets.some((meet) => meet.isPublic === false)
        )
          return true;
        else return false;
      }

      if (filters.status?.toLowerCase() === "join") {
        if (
          venue.meets.some(isMeetNow) &&
          venue.meets.some((meet) => meet.isPublic === true)
        )
          return true;
        else return false;
      }

      if (filters.status?.toLowerCase() === "planned") {
        if (venue.meets.some(isMeetPlanned)) return true;
        else return false;
      }

      if (filters.competitive) {
        return venue.meets.some((meet) => meet.competitive === true);
      }
      if (filters.competitive === false) {
        return venue.meets.some((meet) => meet.competitive === false);
      }
      return true;
    });
  }

  // Mussel gym yoga rummelsdorf public now
  // Weisse Elster basketball alt-treptow private not now competitive
  // Beach club cossi tennis rummelsdorf-oben public now non-competitive
  //Boule bahn berlin boule Friedrichshain private now
  // Filtering for tags!

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
