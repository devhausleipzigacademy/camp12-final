"use server";

import { prisma } from "@/lib/db";

export async function addParticipant(meetId: string, userId: string) {
  try {
    const updatedMeet = await prisma.meet.update({
      where: { id: meetId },
      data: {
        participants: {
          connect: { id: userId },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    await prisma.response.create({
      data: {
        meetId: meetId,
        userId: userId,
        status: "accepted",
      },
    });

    return { success: true, participants: updatedMeet.participants };
  } catch (error) {
    console.error("Failed to add participant:", error);
    return { success: false, error: "Failed to add participant" };
  }
}
