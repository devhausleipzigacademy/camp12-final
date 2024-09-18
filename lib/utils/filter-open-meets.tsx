import { Filters, Meet } from "./types";
import { GetVenuesResult } from "@/app/api/data-acces/get-venues";
import { GetOpenMeetsResult } from "@/app/api/data-acces/get-open-meets";

export function filterOpenMeets(
  openMeets: GetOpenMeetsResult,
  filters: Filters
): GetOpenMeetsResult {
  const now = new Date(2024, 8, 20, 10);

  // Somhow the time is always to hours earlier in the backend but i don't know if thats relevant, it still works

  return openMeets.filter((openMeet: Meet) => {
    if (filters.activity) {
      return (
        openMeet.activityType.name.toLowerCase() ===
        filters.activity?.toLowerCase()
      );
    }
    if (filters.mode) {
      return openMeet.mode.toLowerCase() === filters.mode?.toLowerCase();
    }
    function isMeetNow(meet: Meet) {
      const meetDate = new Date(meet.date);
      const [hours, minutes] = meet.time.split(":").map(Number);

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

    // only show meet that are now or at least today
    if (!isMeetNow(openMeet) && !isMeetPlanned(openMeet)) {
      return false;
    }
    //Possible add-ons for later show meets for a specific day

    // since openMeets are not venues, they shouldn't be free or occupied
    if (filters.status?.toLowerCase() === "free") {
      return false;
    }
    if (filters.status?.toLowerCase() === "occupied") {
      return false;
    }
    if (filters.status === "joinNow") {
      if (isMeetNow(openMeet) && openMeet.isPublic) return true;
      else return false;
    }

    // if (filters.status === "joinToday") {
    //   if (isMeetPlanned(openMeet) && openMeet.isPublic) return true;
    //   else return false;
    // }
    // if (filters.mode === "casual") return true;
    // if (filters.mode === "competetive") {
    //   if (openMeet.mode) return true;
    //   else return false;
    // }
    // if (filters.mode === "softie") {
    //   if (!openMeet.mode) return true;
    //   else return false;
    // }
    return true;
  });
}

// Wann test the fi?
// Mussel gym yoga rummelsdorf free planned both
// Weisse Elster basketball alt-treptow private in past free competitive
// Beach club cossi tennis rummelsdorf-oben free non-competitive
//Boule bahn berlin boule Friedrichshain occupied both
