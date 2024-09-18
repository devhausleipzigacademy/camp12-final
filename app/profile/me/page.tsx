import { protectPage } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";

const MePage = async () => {
  const user = await protectPage();

  redirect(`/profile/${user.id}`, RedirectType.replace);

  return null;
};

export default MePage;
