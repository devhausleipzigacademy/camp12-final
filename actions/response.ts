"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getResponseData(responseId: string) {
  console.log("Fetching response data for ID:", responseId);
  try {
    const response = await prisma.response.findUnique({
      where: { id: responseId },
      include: {
        meet: {
          include: {
            venue: true,
            activityType: true,
            tags: true,
            participants: {
              select: {
                id: true,
                name: true,
                picture: true,
              },
            },
          },
        },
        user: true,
      },
    });

    console.log("Raw response data:", JSON.stringify(response, null, 2));

    if (!response) {
      console.log("Response not found for ID:", responseId);
      return null;
    }

    if (!response.meet) {
      console.log("Meet data not found in response:", responseId);
      return null;
    }

    return response;
  } catch (error) {
    console.error("Error fetching response:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

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
