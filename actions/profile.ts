"use server";

import { protectPage } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ProfilePage = async () => {
  const user = await protectPage();
  try {
    const settings = await prisma.settings.findUniqueOrThrow({
      where: {
        userId: user.id,
      },
    });
    return <ProfilePage />;
  } catch (error) {
    console.log(error, "no settings found for user ", user.id);
  }
};
// userId={user.id} settings={settings}
