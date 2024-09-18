import { updatePicture } from "@/actions/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ChangePicturePage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  return (
    <form action={updatePicture} className="p-4">
      <div className="justify-center items-center">
        <div className="mb-4">
          <Link href="/profile/me">
            <ArrowLeft className="w-6 h-6 text-black" />
          </Link>
        </div>
        <Avatar className="object-cover h-32 w-32 mb-4">
          <AvatarImage src={user?.picture || ""} />
          <AvatarFallback>BB</AvatarFallback>
        </Avatar>
      </div>
      <input type="hidden" name="userId" value={user?.id} />
      <input type="file" className="mb-4" name="image" />
      <Button>Upload Picture</Button>
    </form>
  );
}
