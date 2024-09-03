"use server";
import { prisma } from "@/lib/db";
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
