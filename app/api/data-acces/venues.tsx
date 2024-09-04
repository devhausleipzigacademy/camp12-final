import { prisma } from "@/lib/db";
import { Venue } from "@prisma/client";

export async function getVenues() {
  const venues = await prisma.venue.findMany({
    include: {
      meets: true,
      activityTypes: true,
    },
  });
  return venues;
}

export type GetVenuesResult = Awaited<ReturnType<typeof getVenues>>;
