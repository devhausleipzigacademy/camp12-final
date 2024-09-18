"use server";

import { prisma } from "@/lib/db";
import { Tag } from "@prisma/client";

export async function reportVenue(
  issue: string,
  datetime: Date,
  venueId: string,
  detail?: string
) {
  return prisma.report.create({
    data: {
      issue,
      date: datetime,
      time: datetime.toTimeString().split(" ")[0],
      detail,
      venue: {
        connect: {
          id: venueId,
        },
      },
    },
  });
}

export async function createVenue(
  name: string,
  activityTypes: string[],
  location: number[],
  image: string,
  description?: string,
  tags?: string[],
  address?: string
) {
  return prisma.venue.create({
    data: {
      name,
      activityTypes: {
        connect: activityTypes.map((activity) => ({ id: activity })),
      },
      location,
      image,
      description,
      tags: {
        connect: tags?.length ? tags.map((tag) => ({ name: tag })) : [], // Ensure this matches TagWhereUniqueInput
      },
      address
    },
  });
}
