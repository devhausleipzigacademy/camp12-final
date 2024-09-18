import MeetForm from "@/app/create-meet/page";
import { prisma } from "@/lib/db";

export default async function UpdateMeetPage({
  params,
}: {
  params: { eventId: string };
}) {
  console.log(params.eventId);

  const meet = await prisma.meet.findUnique({
    where: { id: params.eventId },
    include: { activityType: true },
  });
  console.log(meet);

  return <MeetForm meet={meet} />;
}
