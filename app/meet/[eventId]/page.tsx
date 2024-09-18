import { getMeetData } from "@/actions/meet";
import { validateRequest } from "@/lib/auth";
import { EditButton } from "@/components/EditButton";
import { ShareInvite } from "@/components/ShareInvite";
import Back from "@/components/Back";
import { FaBasketball } from "react-icons/fa6";
import { LuMapPin, LuCalendarDays } from "react-icons/lu";
import TagsBadges from "@/components/TagsBadges";
import AvatarList from "@/components/AvatarList";
import { formatDate } from "@/lib/utils/formatDate";
import { Button } from "@/components/ui/button";

export default async function MeetDetailPage({
  params,
}: {
  params: { eventId: string };
}) {
  console.log("Rendering MeetDetailPage with eventId:", params.eventId);

  try {
    const meetData = await getMeetData(params.eventId);
    console.log(
      "Meet data in page component:",
      JSON.stringify(meetData, null, 2)
    );

    if (!meetData) {
      console.log("No meet data found");
      return <div>Meet not found</div>;
    }

    const { user } = await validateRequest();
    const currentUserId = user?.id || "";

    const isParticipating = meetData.participants.some(
      (p) => p.id === currentUserId
    );

    return (
      <div className="h-screen flex flex-col bg-white">
        <div className="relative h-2/5">
          <Back className="absolute top-4 left-4 z-10" />
          <ShareInvite
            responseId={meetData.id}
            userId={currentUserId}
            creatorId={meetData.creator.id}
            isPublic={meetData.isPublic}
          />
          <img
            className="w-full h-full object-cover"
            src={meetData.venue?.image || "/signin-hero.jpg"}
            alt={meetData.venue?.name || "Event venue"}
          />
        </div>
        <main className="flex flex-col h-3/5 bg-white rounded-t-3xl -mt-6 relative z-10 overflow-hidden">
          <div className="flex-grow overflow-y-auto  py-6">
            <div className="flex flex-col gap-4 ">
              <div className="flex gap-2 px-5">
                <FaBasketball className="size-6 fill-orange" />
                <p className="font-medium">
                  {meetData.activityType?.name || "Activity"}
                </p>
              </div>
              <div className="flex justify-between px-5">
                <h1 className="text-xl font-semibold">
                  {meetData.activityType?.name || "Meet"}
                </h1>
                <EditButton
                  userId={currentUserId}
                  creatorId={meetData.creator.id}
                />
              </div>
              <div className="flex gap-1 px-5">
                <LuMapPin className="size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {meetData.venue?.name ||
                    meetData.address ||
                    "Location not specified"}
                </p>
              </div>
              <div className="flex gap-1 px-5">
                <LuCalendarDays className="size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {meetData.date
                    ? formatDate(meetData.date)
                    : "Date not specified"}{" "}
                  - {meetData.time || "Time not specified"}
                  {meetData.isRecurring && " (recurring)"}
                </p>
              </div>
              <AvatarList
                people={meetData.participants}
                type="participants"
                meetId={meetData.id}
              />
              {meetData.tags && meetData.tags.length > 0 && (
                <TagsBadges tags={meetData.tags} />
              )}
              <label htmlFor="description" className="font-semibold pt-4 px-5">
                About the meet
              </label>
              <p className="text-muted-foreground px-5">
                {meetData.notes || "No description available."}
              </p>
            </div>
          </div>
          <div className="p-5">
            <Button
              className={`w-full font-medium text-white rounded-lg py-4 ${
                isParticipating ? "bg-green-500" : "bg-slate-900"
              }`}
              disabled={isParticipating}
            >
              {isParticipating ? "Participating" : "Participate"}
            </Button>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error in MeetDetailPage:", error);
    return <div>An error occurred while loading the meet details</div>;
  }
}
