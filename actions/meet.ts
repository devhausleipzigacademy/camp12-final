"use server";
// Import necessary dependencies
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { isFuture, isToday, format } from "date-fns";
import { meetSchema } from "@/lib/validation/zod-meet";
import { z } from "zod";
import { FaAddressBook } from "react-icons/fa6";
import { redirect } from "next/navigation";

// Helper function to check if a given time is in the future
function isTimeInFuture(time: string) {
  // Convert time string to a number (e.g., "14:30" becomes 1430)
  const meetTimeNumber = parseInt(time.replace(":", ""));
  // Get current time as a number in "hhmm" format
  const timeNowNumber = parseInt(format(new Date(), "hhmm"));
  // Compare meet time with current time
  return meetTimeNumber > timeNowNumber;
}

// get creatorId from params

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
    revalidatePath("/meets");

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

export async function updateMeet(
  meetId: string,
  values: z.infer<typeof meetSchema>
) {
  await prisma.meet.update({
    where: {
      id: meetId,
    },
    data: {
      date: values.date,
      time: values.time,
      duration: values.duration,
      isPublic: values.public,
      groupSize: Number(values.groupSize),
      notes: values.description,
    },
  });
}

export const submitMeetWithVenue = async (
  values: z.infer<typeof meetSchema>,
  creatorId: string,
  venueId: string
) => {
  const meet = await prisma.meet.create({
    data: {
      date: values.date,
      time: values.time,
      duration: values.duration,
      mode: values.mode,
      isPublic: values.public,
      isRecurring: values.recurring,
      groupSize: Number(values.groupSize),
      participants: {},
      notes: values.description,
      equipment: values.equipment,
      creator: {
        connect: {
          id: creatorId,
        },
      },
      venue: {
        connect: {
          id: venueId,
        },
      },
      activityType: {
        connect: {
          name: values.activityType,
        },
      },
    },
  });
  redirect(`/meet/${meet?.id}`);
};

export async function getMeetData(meetId: string) {
  console.log("Fetching meet data for ID:", meetId);
  try {
    const meet = await prisma.meet.findUnique({
      where: { id: meetId },
      include: {
        venue: true,
        activityType: true,
        creator: {
          select: {
            id: true,
            name: true,
            picture: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            picture: true,
          },
        },
        tags: true, // Hier fügen wir die tags hinzu
      },
    });

    console.log("Raw meet data:", JSON.stringify(meet, null, 2));

    if (!meet) {
      console.log("Meet not found for ID:", meetId);
      return null;
    }

    return meet;
  } catch (error) {
    console.error("Error fetching meet:", error);
    throw error;
  }
}

export const submitMeetWithLocation = async (
  values: z.infer<typeof meetSchema>,
  creatorId: string,
  locationArray: number[],
  address?: string | null,
  
) => {
  const meet = await prisma.meet.create({
    data: {
      date: values.date,
      mode: values.mode,
      time: values.time,
      duration: values.duration,
      isPublic: values.public,
      isRecurring: values.recurring,
      groupSize: Number(values.groupSize),
      participants: {},
      notes: values.description,
      equipment: values.equipment,
      address: address,
      creator: {
        connect: {
          id: creatorId,
        },
      },
      activityType: {
        connect: {
          name: values.activityType,
        },
      },
      location: locationArray,
    },
  });
  redirect(`/meet/${meet?.id}`);
};
