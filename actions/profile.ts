"use server";

import { prisma } from "@/lib/db";
import { backendClient } from "@/lib/edgestore-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const updatePicture = async (formData: FormData) => {
  const image = formData.get("image") as File;
  const userId = formData.get("userId") as string;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  console.log({ userId, image });

  const buffer = await image.arrayBuffer();

  const blob = new Blob([new Uint8Array(buffer)], { type: image.type });

  const res = await backendClient.publicFiles.upload({
    content: {
      blob,
      extension: image.type,
    },
    options: {
      replaceTargetUrl: user?.picture || undefined,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { picture: res.url },
  });

  revalidatePath(`/profile/${userId}/update`);
  redirect(`/profile/${userId}/update`);

  // await prisma.user.update({
  //   where: { id: userId },
  //   data: { picture: url },
  // });
  // revalidatePath(`/profile/${userId}/update`);
};

export const updateProfile = async (
  userId: string,
  name: string,
  bio: string
) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      bio,
    },
  });
  revalidatePath(`/profile/${userId}`);
  redirect("/profile/me");
};
