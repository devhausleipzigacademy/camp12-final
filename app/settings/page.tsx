import SettingsUser from "@/components/settingsUser";
import { protectPage } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cookies, headers } from "next/headers";

const UserSettings = async () => {
  const user = await protectPage();

  try {
    const settings = await prisma.settings.findUniqueOrThrow({
      where: {
        userId: user.id,
      },
    });
    return <SettingsUser userId={user.id} settings={settings} />;
  } catch (error) {
    console.log(error, "no settings found for user ", user.id);
  }
};

export default UserSettings;
