import Search from "@/components/Search";
import MapAndDrawer from "@/components/MapAndDrawer";
import { getVenues } from "./api/data-acces/get-venues";
import { FilterDrawer } from "@/components/FilterDrawer";
import { filterVenues } from "@/lib/utils/filter-venues";
import { getOpenMeets } from "./api/data-acces/get-open-meets";
import { filterOpenMeets } from "@/lib/utils/filter-open-meets";
import {
  getAllMeets,
  getUserCreatedMeets,
  getUserParticipatingMeets,
} from "@/lib/utils/getMeets";
import { prisma } from "@/lib/db";
import { protectPage, validateRequest } from "@/lib/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] };
}) {
  const venues = await getVenues();

  const openMeets = await getOpenMeets();

  const meets = await getAllMeets();

  const { user } = await validateRequest();
  console.log("user");
  console.log(user);

  const parseBoolean = (val: string) => (val === "true" ? true : false);

  const filters = {
    activity: (searchParams.activity as string) ?? "",
    status: (searchParams.status as string) ?? "",
    mode: (searchParams.mode as string) ?? "",
  };

  const myMeets = await getUserCreatedMeets(user?.id);
  const participatingMeets = await getUserParticipatingMeets(user?.id);
  const activities = await prisma.activityType.findMany({});
  console.log(filters);

  const filteredVenues = filterVenues(venues, filters);

  const filteredOpenMeets = filterOpenMeets(openMeets, filters);
  return (
    <div className="h-screen relative overflow-hidden">
      <MapAndDrawer
        venues={filteredVenues}
        openMeets={filteredOpenMeets}
        userCreatedMeets={myMeets}
        userPariticpatingMeets={participatingMeets}
        meets={meets}
        user={user as any}
      />
      <Search />
      <FilterDrawer activities={activities} />
    </div>
  );
}
