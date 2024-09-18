import { prisma } from "../db";

export async function getUserCreatedMeets(userId?: string) {
  if (!userId) return [];
  const meets = await prisma.meet.findMany({
    where: { creatorId: userId },
    include: {
      venue: true,
      activityType: true,
      participants: true,
      creator: true,
    },
  });
  return meets;
}

export type UserCreatedMeet = Awaited<
  ReturnType<typeof getUserCreatedMeets>
>[number];

export async function getUserParticipatingMeets(userId?: string) {
  if (!userId) return [];
  const meets = await prisma.meet.findMany({
    where: { participants: { some: { id: userId } } },
    include: {
      venue: true,
      activityType: true,
      participants: true,
      creator: true,
    },
  });
  return meets;
}

export type UserParticipatingMeet = Awaited<
  ReturnType<typeof getUserParticipatingMeets>
>[number];

export async function getAllMeets() {
  const meets = await prisma.meet.findMany({
    include: {
      venue: true,
      activityType: true,
      participants: true,
    },
  });
  return meets;
}

export type AllMeet = Awaited<ReturnType<typeof getAllMeets>>[number];


