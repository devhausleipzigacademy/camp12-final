import { prisma } from "@/lib/db";
import CreateMeet from "./meet";

// model Meet {
//   id             String       @id @default(uuid())
//   date           DateTime
//   time           String
//   duration       Float
//   isPublic       Boolean      @default(false)
//   creatorId      String
//   creator        User         @relation("CreatedMeets", fields: [creatorId], references: [id], onDelete: Cascade)
//   participants   User[]       @relation("ParticipatedMeets")
//   guests         Int
//   notes          String?
//   tags           Tag[]
//   Venue          Venue        @relation(fields: [venueId], references: [id], onDelete: Cascade)
//   venueId        String
//   activityType   ActivityType @relation(fields: [activityTypeId], references: [id])
//   activityTypeId String
// }

export default async function UpdateMeet() {
  const tags = await prisma.tag.findMany();
  // this has to be read from params when connected to the map
  let venue = null;
  try {
    venue = await prisma.venue.findUnique({
      where: { name: "Weisse Elster" },
    });
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      <CreateMeet
        isPublic={false}
        creatorId={"as222fkt547eu392"}
        guests={0}
        venueId={venue.id}
        venueName={venue.name}
        tagSuggestions={tags}
      />
    </div>
  );
}
