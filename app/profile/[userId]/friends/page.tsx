import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FriendCard } from "@/components/friend-card";
import { findFriends } from "@/actions/friends";
import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import { BackArrow } from "@/components/BackArrow";

export default async function FriendsListPage({
  params,
}: {
  params: { userId: string };
}) {
  const { user } = await validateRequest();
  const friends = await findFriends(params.userId);

  if (!friends?.length)
    return (
			<div className='flex flex-col items-center justify-center p-10 m-5 g-5'>
				<BackArrow variant='link' />
				<p className='font-bold text-xl text-center'>
					No friends yet, add some friends by sharing your QR-Code:
				</p>
				<Link
					href={`/`}
					className='m-5 p-10'
				>
					<Button>Generate QR-Code</Button>
				</Link>
				<img
					className='w-screen flex-1 object-cover object-left p-5 mt-10'
					src='/signin-hero.jpg'
					alt='Person sitting on a ping pong table'
				/>
			</div>
		);

  return (
    <div className="max-w-md mx-auto bg-background text-foreground">
      <div className="flex items-center pt-5 pb-2 pl-2 pr-2">
        <Button variant="ghost" size="icon" className="mr-2 ">
          <Link href={`/profile/${user?.id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-sm font-normal flex-grow text-center pr-8">
          Friends
        </h1>
        <div className="h-5 w-5"></div>
      </div>
      <div className="p-4 space-y-4">
        {friends.map((friend, index) => (
          <FriendCard key={index} user={friend} myUserId={user?.id ?? null} />
        ))}
      </div>
    </div>
  );
}
