import { EditButton } from "@/components/EditButton";
import { ShareInvite } from "@/components/ShareInvite";
import { prisma } from "@/lib/db";
import Back from "@/components/Back";
import { FaBasketball } from "react-icons/fa6";
import { LuMapPin } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { FaBaby } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa6";
import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { FaPersonWalking } from "react-icons/fa6";
import { format } from "date-fns";

export default async function MeetDetail({
  params,
}: {
  params: { eventId: string };
}) {
  const meet = await prisma.meet.findUnique({
    where: { id: params.eventId },
    include: {
      participants: true,
      creator: true,
      venue: true,
      activityType: true,
      tags: true,
    },
  });

  if (!meet) {
    throw new Error("Meet not found");
  }

  const { eventId } = params;

  // Helper function to get icon based on activity type
  const getActivityIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case "basketball":
        return <FaBasketball className="size-6 fill-orange" />;
      // Add more cases for other activity types
      default:
        return <FaBasketball className="size-6 fill-orange" />;
    }
  };

  return (
    <div className="h-screen flex flex-col items-center bg-white relative">
      <Back />
      <ShareInvite
        responseId={meet.id}
        userId={meet.creatorId}
        creatorId={meet.creatorId}
        isPublic={meet.isPublic}
      />
      <img
        className="w-screen object-cover h-2/5"
        src="../signin-hero.jpg"
        alt="Person sitting on a ping pong table"
      />
      <main className="absolute top-[33%] left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-lg overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between p-3"></header>
        {/* main */}
        <section className="absolute, ">
          <div className="flex flex-col gap-4 px-5">
            <div className="flex gap-2">
              {getActivityIcon(meet.activityType.name)}
              <p className="font-medium">{meet.activityType.name}</p>
            </div>
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold">
                {meet.activityType.name} Meet
              </h1>
              <EditButton userId={meet.creatorId} creatorId={meet.creatorId} />
            </div>
            <div className="flex gap-1">
              <LuMapPin className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {meet.venue ? meet.venue.name : meet.address}, {meet.address}
              </p>
            </div>
            <div className="flex gap-1">
              <LuCalendarDays className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {format(new Date(meet.date), "EEE dd MMM yyyy")} - {meet.time}
                {meet.isRecurring ? " (recurring)" : ""}
              </p>
            </div>
          </div>
          <Separator className="my-5 w-full" />
          <div className="flex justify-between w-full items-center px-5 mb-5">
            <div className="flex">
              {/* {friendsImages.map((url, index) => (
                <Avatar
                  key={index}
                  className={`w-10 h-10 overflow-hidden relative ring-2 ring-white ${
                    index !== 0 ? "-ml-2" : ""
                  } z-${10 - index}`}
                >
                  <img
                    src={url}
                    alt={`friend-image-${index}`}
                    className="w-full h-full object-cover"
                  />
                </Avatar>
              ))} */}
              <Avatar className="h-10 w-10 -ml-2 ring-2 ring-white">
                <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                <AvatarFallback>+15</AvatarFallback>
              </Avatar>
            </div>
            <Link href={"/profile/friends"}>
              <LuArrowRight className="size-5" />
            </Link>
          </div>
          <Separator className="my-5" />

          <div className="flex flex-col justify-start text-start gap-2 mt-2">
            <div className="flex flex-wrap gap-2 px-5">
              <Badge
                variant="default"
                className=" flex gap-1 bg-turquoise text-black rounded-xl"
              >
                <FaBaby />
                Beginner-friendly
              </Badge>
              <Badge
                variant="default"
                className="flex gap-1 bg-pink  text-black rounded-xl"
              >
                <FaTrophy />
                Competetive
              </Badge>
              <Badge
                variant="default"
                className="flex gap-1 bg-rose  text-black rounded-xl"
              >
                <FaTableTennisPaddleBall />
                Equipment needed
              </Badge>
              <Badge
                variant="default"
                className="flex gap-1 bg-yellowish  text-black rounded-xl"
              >
                <FaPersonWalking />
                Players wanted
              </Badge>
            </div>
            <label htmlFor="description" className="font-semibold px-5 pt-4">
              About the meet
            </label>
            <p className="text-muted-foreground px-5">
              The king, seeing how much happier his subjects were, realized the
              error of his ways and repealed the joke tax.
            </p>
          </div>
        </section>
        {/* Button */}
        <div className="flex flex-col items-stretch flex-grow justify-end mb-14 mt-6 px-5">
          <button className="bg-slate-900 font-medium text-white rounded-lg py-4">
            Participate
          </button>
        </div>
      </main>
    </div>
  );
}
