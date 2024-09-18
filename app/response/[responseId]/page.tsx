// app/response/[responseId]/page.tsx
import { getResponseData } from "@/actions/response";
import { LuMapPin, LuCalendarDays } from "react-icons/lu";
import ResponseInteraction from "@/components/ResponseInteraction";
import TagsBadges from "@/components/TagsBadges";
import AvatarList from "@/components/AvatarList";
import Link from "next/link";
import Home from "@/components/Home";

export default async function Response({
  params,
}: {
  params: { responseId: string };
}) {
  const response = await getResponseData(params.responseId);
  const { meet, user } = response;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Home />
      <div className="relative flex-grow flex flex-col">
        <img
          className="w-full h-2/5 object-cover"
          src={meet.venue?.image || "../signin-hero.jpg"}
          alt="Person sitting on a ping pong table"
        />
        <main className="flex-grow flex flex-col bg-white rounded-t-3xl shadow-lg -mt-8 relative z-10">
          <div className="flex-grow overflow-y-auto py-5">
            <section>
              <div className="flex flex-col gap-4 px-5">
                <div className="flex justify-between">
                  <h1 className="text-xl font-semibold">
                    {meet.activityType.name}
                  </h1>
                </div>
                <div className="flex gap-1">
                  <LuMapPin className="size-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {meet.venue
                      ? `${meet.venue.name}, ${meet.venue.address}`
                      : meet.address}
                  </p>
                </div>
                <div className="flex gap-1">
                  <LuCalendarDays className="size-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {formatDate(meet.date)} - {meet.time} Uhr
                  </p>
                </div>
                <div>
                  <Link
                    href={`/meet/${meet.id}`}
                    className="underline text-black"
                  >
                    Meet Details
                  </Link>
                </div>
                <div>
                  <p className="font-semibold text-s pt-8">Andere Teilnehmer</p>
                </div>
              </div>
              <AvatarList
                people={meet.participants}
                type="participants"
                meetId={meet.id}
              />
              <TagsBadges tags={meet.tags} />
            </section>
          </div>
          <div className="mt-auto pb-5">
            <ResponseInteraction meetId={meet.id} />
          </div>
        </main>
      </div>
    </div>
  );
}
