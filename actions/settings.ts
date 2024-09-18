"use server";
import { prisma } from "@/lib/db";
import { Tag } from "@prisma/client";
import { VisibilityStatus } from "@prisma/client";

interface SettingsProps {
  friendsVisible: VisibilityStatus;
  profileVisible: VisibilityStatus;
  userId: string;
}

// Function to handle the form submission
export const updateSettings = async ({
  friendsVisible,
  profileVisible,
  userId,
}: SettingsProps) => {
  await prisma.settings.update({
    where: { userId: userId },
    data: {
      friendsVisibility: friendsVisible,
      profileVisibility: profileVisible,
    },
  });
};

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
  console.log("Tag ${tag.name} updated or created successfully");
};

interface MeetProps {
  date: Date;
  time: string;
  duration: number;
  isPublic: boolean;
  creatorId: string;
  groupSize: number;
  notes?: string;
  venueId: string;
  activityTypeName: string;
}

export const createMeet = async ({
  date,
  time,
  duration,
  isPublic,
  creatorId,
  groupSize,
  notes,
  venueId,
  activityTypeName,
}: MeetProps) => {
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
      venue: {
        connect: {
          id: venueId,
        },
      },
      activityType: {
        connect: {
          name: activityTypeName,
        },
      },
      groupSize,
      notes: notes,
    },
  });
};
