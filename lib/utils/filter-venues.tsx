import { Meet } from "@prisma/client";
import { Filters, Venue } from "./types";
import { GetVenuesResult } from "@/app/api/data-acces/get-venues";

export function filterVenues(
  venues: GetVenuesResult,
  filters: Filters
): GetVenuesResult {
  const now = new Date(2024, 8, 20, 10);

  // Somhow the time is always to hours earlier in the backend but i don't know if thats relevant, it still works

  return venues.filter((venue: Venue) => {
    if (filters.activity) {
      return venue.activityTypes.some(
        (at) => at.name.toLowerCase() === filters.activity?.toLowerCase()
      );
    }

    if (filters.mode) {
      return venue.meets.some(
        (meet) => meet.mode.toLowerCase() === filters.mode?.toLowerCase()
      );
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

    if (filters.status?.toLowerCase() === "free") {
      if (venue.meets.length === 0) return true;
      return !venue.meets.some(isMeetNow);
    }

    // do we need an occupied filter actually?
    if (filters.status?.toLowerCase() === "occupied") {
      if (venue.meets.some((meet) => isMeetNow(meet) && !meet.isPublic))
        return true;
      else return false;
    }

    if (filters.status === "joinNow") {
      if (venue.meets.some((meet) => isMeetNow(meet) && meet.isPublic))
        return true;
      else return false;
    }

    if (filters.status === "joinToday") {
      if (
        venue.meets.some(isMeetPlanned) &&
        venue.meets.some((meet) => meet.isPublic)
      )
        return true;
      else return false;
    }

    return true;
  });
}

// Wann test the fi?
// Mussel gym yoga rummelsdorf free planned both
// Weisse Elster basketball alt-treptow private in past free competitive
// Beach club cossi tennis rummelsdorf-oben free non-competitive
//Boule bahn berlin boule Friedrichshain occupied both
