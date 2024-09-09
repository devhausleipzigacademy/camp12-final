"use server";

// Import necessary dependencies
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { isFuture, isToday, format } from "date-fns";
import { Tag } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Helper function to check if a given time is in the future
function isTimeInFuture(time: string) {
  // Convert time string to a number (e.g., "14:30" becomes 1430)
  const meetTimeNumber = parseInt(time.replace(":", ""));
  // Get current time as a number in "hhmm" format
  const timeNowNumber = parseInt(format(new Date(), "hhmm"));
  // Compare meet time with current time
  return meetTimeNumber > timeNowNumber;
}
// const venue = await prisma.venue.findUniqueOrThrow({
//   where: {},
// });

// creating a meet / session
interface MeetProps {
  date: Date;
  time: string;
  duration: number;
  isPublic: boolean;
  creatorId: string;
  mode: string;
  guests: number;
  notes?: string;
  venueId: string;
  activityTypeId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      activityType,
      mode,
      public: isPublic,
      date,
      time,
      duration,
      guests,
      notes,
      venueId,
    } = req.body;

    try {
      const activityTypeRecord = await prisma.activityType.findUnique({
        where: { name: activityType },
      });

      if (!activityTypeRecord) {
        throw new Error(`ActivityType "${activityType}" not found`);
      }

      await createMeet({
        date: new Date(date),
        time: time,
        duration: duration,
        mode,
        isPublic,
        creatorId: "1", // replace with the actual creatorId
        guests,
        notes,
        venueId,
        activityTypeId: activityTypeRecord.id,
      });

      res.status(200).json({ message: "Meet created successfully" });
    } catch (error) {
      console.error("failed to create meet:", error);
      res.status(500).json({ message: "Failed to create meet" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export async function createMeet({
  date,
  time,
  duration,
  isPublic,
  creatorId,
  guests,
  notes,
  venueId,
  activityTypeId,
}: MeetProps) {
  await prisma.meet.create({
    data: {
      date: date,
      time: time,
      duration: duration,
      isPublic: isPublic,
      creator: {
        connect: {
          id: creatorId,
        },
      },
      Venue: {
        connect: {
          id: venueId,
        },
      },
      activityType: {
        connect: {
          id: activityTypeId,
        },
      },
      guests: guests,
      notes: notes,
    },
  });
}

// Main function to delete a meet
export async function deleteMeet(meetId: string, userId: string) {
  try {
    // Fetch the meet from the database using its ID
    const meet = await prisma.meet.findUnique({
      where: { id: meetId },
    });

    // If the meet doesn't exist, return an error message
    if (!meet) {
      return { success: false, message: "Meeting not found" };
    }

    // Check if the user trying to delete is the creator of the meet
    if (meet.creatorId !== userId) {
      return {
        success: false,
        message: "User is not the creator of this meeting",
      };
    }

    // Check if the meet date is in the future
    if (!isFuture(meet.date)) {
      return { success: false, message: "Cannot delete past or ongoing meets" };
    }

    // If the meet is today, check if the time is in the future
    if (isToday(meet.date) && !isTimeInFuture(meet.time)) {
      return { success: false, message: "Cannot delete past or ongoing meets" };
    }

    // If all checks pass, delete the meet from the database
    await prisma.meet.delete({
      where: { id: meetId },
    });

    // Revalidate the path to update the UI
    revalidatePath("/meet");

    // Return success message
    return { success: true, message: "Meet deleted successfully" };
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error deleting meet:", error);
    // Return a generic error message to the user
    return {
      success: false,
      message: "An error occurred while deleting the meet",
    };
  }
}

// Tag creation on meet

type Props = {
  names: string[];
  tag?: Tag;
};
// update new tags that are added by the user by checking if it exists and if not add it to db

export const updateTags = async ({ names, tag }: Props) => {
  const exisitngTags = await prisma.tag.findMany({ select: { name: true } });

  const exisitngTagNames = new Set(exisitngTags.map((t) => t.name));

  const newTags = names.filter((name) => !exisitngTagNames.has(name));

  if (newTags.length > 0) {
    await prisma.tag.createMany({
      data: newTags.map((name) => ({ name })),
      skipDuplicates: true,
    });
  }

  if (tag && tag.name) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: tag,
      create: tag,
    });
  }
  console.log("Tag ${tag.name} updatetd or created successfully");
};
