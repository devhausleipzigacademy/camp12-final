import HeaderNav from "@/components/HeaderNav";
import MeetCard from "@/components/MeetCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { lucia, validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CalendarDaysIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LuArrowRight } from "react-icons/lu";
import { ActionResult } from "@/lib/utils/types";
import { DrawerUpComingSessions } from "@/components/DrawerUpComingSessions";

export default async function ProfilePage({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      badges: true,
      friends: true,
      settings: true,
      city: true,
      meetsCreated: {
        include: {
          // venue: true,
          activityType: true,
          participants: true,
          creator: true,
        },
      },
    },
  });

  const { user: loggedInUser } = await validateRequest();

  const loggedInUserId = loggedInUser?.id;
  function isOwnProfile() {
    return loggedInUser?.id === user?.id;
  }

  if (!user) return <p>User not found</p>;

  const FRIENDS_SHOWN = 8;

  // async function logout(): Promise<ActionResult> {
  //   "use server";
  //   const { session } = await validateRequest();
  //   if (!session) {
  //     return {
  //       error: "Unauthorized",
  //     };
  //   }

  //   await lucia.invalidateSession(session.id);

  //   const sessionCookie = lucia.createBlankSessionCookie();
  //   cookies().set(
  //     sessionCookie.name,
  //     sessionCookie.value,
  //     sessionCookie.attributes
  //   );
  //   return redirect("/login");
  // }

  function showPicture() {
    if (user?.settings?.profileVisibility === "Public") return user.picture;
    if (loggedInUser?.id === user?.id) return user?.picture;
    if (user?.settings?.profileVisibility === "FriendsOnly") {
      if (user.friends.some((f) => f.id === loggedInUser?.id))
        return user.picture;
      return "";
    }
    return "";
  }

  return (
    <div>
      <div className={isOwnProfile() ? "" : "hidden"}>
        <HeaderNav loggedInUserId={loggedInUserId} />
      </div>

      <div className="flex flex-col items-center pt-5">
        <Avatar className="h-40 w-40">
          <AvatarImage
            src={showPicture()}
            alt="@shadcn"
            className="object-cover"
          />
          <AvatarFallback>BB</AvatarFallback>
        </Avatar>
        <div className="pt-4 text-lg font-semibold">
          {user?.name ?? "No name provided"}
        </div>
        <div className="mt-2 text-sm text-muted-foreground px-11 text-center pt-3">
          {user.bio ?? "space for your bio"}
        </div>
        <div className="mt-2 text-sm text-muted-foreground px-11 text-center pt-3">
          {user.cityName}
        </div>
        <Separator className="my-5" />
        <div className="flex items-center w-full px-4">
          {user.settings?.profileVisibility === "Private" ? (
            <p className="m-auto text-muted-foreground">
              Only visible for friends sorry!
            </p>
          ) : (
            <div className="flex overflow-x-auto py-2 space-x-4 scrollbar-hide">
              {user?.badges.map((badge, index) => (
                <div key={index} className="flex-shrink-0">
                  <img
                    src={badge.icon || undefined}
                    alt={badge.name}
                    className="w-12 h-12 object-contain"
                    title={badge.name}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <Separator className="my-5" />

        <div className="flex justify-between w-full items-center px-5 mb-5">
          {user.settings?.profileVisibility === "Private" ? (
            <>
              <p className="h-10 w-10 -ml-2 ring-2 flex items-center justify-center bg-muted rounded-full z-50 ring-white text-muted-foreground text-sm">
                {user.friends.length}
              </p>{" "}
              <small className="text-muted-foreground text-sm">
                Get in touch to see full list of friends!
              </small>
            </>
          ) : (
            <div className="flex">
              {user?.friends ? (
                <>
                  {user.friends.slice(0, FRIENDS_SHOWN).map((friend, index) => (
                    <Avatar
                      key={friend.id}
                      className={`w-10 h-10 overflow-hidden relative ring-2 ring-white ${
                        index !== 0 ? "-ml-2" : ""
                      } z-${10 - index}`}
                    >
                      {user.settings?.profileVisibility === "Private" ? (
                        <AvatarImage
                          src={"/user-icon.png"}
                          alt="@shadcn"
                          className="object-cover bg-slate-50 w-12"
                        />
                      ) : (
                        <AvatarImage
                          src={friend.picture ?? ""}
                          alt="@shadcn"
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback>{"F" + index}</AvatarFallback>
                    </Avatar>
                  ))}
                  {user.friends.length > FRIENDS_SHOWN ? (
                    <div className="h-10 w-10 -ml-2 ring-2 flex items-center justify-center bg-muted rounded-full z-50 ring-white">
                      {`+${user?.friends.length - FRIENDS_SHOWN}`}
                    </div>
                  ) : null}
                </>
              ) : (
                <p>No friends</p>
              )}
            </div>
          )}

          <Link href={`/profile/${user.id}/friends`}>
            <LuArrowRight
              className={
                user.settings?.profileVisibility === "Private"
                  ? "hidden"
                  : "size-5"
              }
            />
          </Link>
        </div>
        <Button
          variant="secondary"
          className="self-stretch text-center block ml-5 mr-5"
          asChild
        >
          <Link href={"/qr-add-friend"}>Add Friend</Link>
        </Button>

        <Separator className="my-5" />
        <div className="flex items-center w-full justify-between px-5 mb-4">
          <p className="font-semibold">Sessions</p>
          <DrawerUpComingSessions defaultTab="own-meets">
            <div className=" font-semibold underline">view all</div>
          </DrawerUpComingSessions>
        </div>
        <div
          className={
            user.settings?.profileVisibility === "Private"
              ? "hidden"
              : "space-y-3 px-5"
          }
        >
          {user.meetsCreated.map((meet) => (
            <MeetCard key={meet.id} meet={meet} />
          ))}
        </div>
      </div>
    </div>
  );
}
