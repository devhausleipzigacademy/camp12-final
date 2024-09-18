import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { protectPage } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { BackArrow } from "@/components/BackArrow";

export default async function FriendPage({
	searchParams,
}: {
	searchParams: { userId: string };
}) {
	const user = await protectPage();
	const friend = await prisma.user.findUnique({
		where: {
			id: searchParams.userId,
		},
	});

	const connectURL = `/api/new-friend?user-one=${searchParams.userId}&user-two=${user.id}`;

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-4">
      <div className="w-full max-w-sm bg-white rounded-lg p-6 flex flex-col justify-between flex-grow">
        <div className="flex justify-start mb-6">
          <Link href="/profile">
            <ArrowLeft className="text-black w-6 h-6" />
          </Link>
        </div>
        <div className="flex flex-col items-center flex-grow justify-center">
          <h1 className="text-3xl font-bold text-center mb-2">
            Do you want to become friends
            {friend? ` with ${friend.name}` : ""}?
          </h1>
        </div>
        <div className="flex items-center justify-center gap-5">
          <Link href={connectURL}>
            <Button className="h-11 w-32 items-center py-6">Yes</Button>
          </Link>
          <Button className="h-11 w-32 items-center py-6">No</Button>
        </div>
      </div>
    </div>
  );
}

