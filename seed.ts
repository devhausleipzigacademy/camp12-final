import { prisma } from "./lib/db";
import { generateIdFromEntropySize } from "lucia";

async function main() {
  console.log("Cleaning Database...");

  // Delete data in the correct order to avoid foreign key constraint errors
  await prisma.response.deleteMany();
  await prisma.meet.deleteMany();
  await prisma.report.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.meet.deleteMany();
  await prisma.city.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.activityType.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.city.deleteMany();

  console.log("Cleaning Database finished");

  // Activity Types
  const basketball = await prisma.activityType.create({
    data: {
      name: "Basketball",
      description: "A team sport played on a court",
      requiredNumberOfParticipants: 10,
    },
  });

  const tennis = await prisma.activityType.create({
    data: {
      name: "Tennis",
      description: "A racket sport played individually or in doubles",
      requiredNumberOfParticipants: 2,
    },
  });

  const yoga = await prisma.activityType.create({
    data: {
      name: "Yoga",
      description: "A physical and mental practice",
      requiredNumberOfParticipants: 1,
    },
  });

  const boule = await prisma.activityType.create({
    data: {
      name: "Boule",
      description: "Tossing metal balls and drinking pastis",
      requiredNumberOfParticipants: 2,
    },
  });
  const tableTennis = await prisma.activityType.create({
    data: {
      name: "Table Tennis",
      description: "Fast-paced sport with paddles and lightweight ball",
      requiredNumberOfParticipants: 2,
    },
  });

  // Venues
  const weisseElster = await prisma.venue.create({
    data: {
      name: "Weisser Rabe",
      address: "Weisser Rabe 12 in 161 Leipzig",
      description: "Classic spot. absolutely balling here.",
      location: [51.330184277926, 12.371808439493],
      image: "/elster.jpg",
      activityTypes: {
        connect: {
          id: tennis.id,
        },
      },
    },
  });

  const musselGym = await prisma.venue.create({
    data: {
      name: "Mussel Gym",
      description:
        "Very nice Venue where you can play tabletennis a lot without getting kicked.",
      location: [51.34037781763, 12.32281923294],
      address: "Mussel Gym 12 in 161 Leipzig",
      image: "/mussel.jpg",
      activityTypes: {
        connect: {
          id: yoga.id,
        },
      },
    },
  });

  const beachClubCossi = await prisma.venue.create({
    data: {
      name: "Beach Club Cossi",
      description:
        "Its nearby a lake, so on the hot days you can jump into the cossi and enjoy a round of swimming.",
      address: "Beach Club Cossi 12 in 161 Leipzig",
      location: [51.317229196977, 12.334948182106],
      image: "/cossi.jpg",
      activityTypes: {
        connect: {
          id: basketball.id,
        },
      },
    },
  });

  const bouleBahnBerlin = await prisma.venue.create({
    data: {
      name: "Boule Bahn Berlin",
      description:
        "Playing boule with friends here is very nice. It's quiet and easy to access.",
      address: "Boule Bahn Berlin 12 in 161 Leipzig",
      location: [51.320008587211, 12.337681353092],
      image: "/example.png",
      activityTypes: {
        connect: {
          id: boule.id,
        },
      },
    },
  });

  const tableTennis001 = await prisma.venue.create({
    data: {
      name: "Ping Pong Table - Güntz Park",
      address: "Dr.-Güntz-Park in 04299 Leipzig",
      location: [51.32106056582742, 12.409769051059083],
      image: "/venue-img/IMG_5534.jpg",
      activityTypes: {
        connect: {
          id: tableTennis.id,
        },
      },
    },
  });

  // Users
  const user1 = await prisma.user.create({
    data: {
      id: generateIdFromEntropySize(10),
      email: "user1@example.com",
      name: "Hans Meiser",
      city: {
        create: {
          name: "Leipzig",
        },
      },
      settings: {
        create: {
          friendsVisibility: "Private",
          profileVisibility: "Private",
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: generateIdFromEntropySize(10),
      email: "user2@example.com",
      name: "Tine Wittler",
      settings: {
        create: {
          friendsVisibility: "FriendsOnly",
          profileVisibility: "FriendsOnly",
        },
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      id: generateIdFromEntropySize(10),
      email: "user3@example.com",
      name: "Conchita Wurst",
      city: {
        create: {
          name: "Berlin",
        },
      },
      settings: {
        create: {
          friendsVisibility: "Public",
          profileVisibility: "Public",
        },
      },
    },
  });

  // Tags
  await prisma.tag.create({ data: { name: "public ground" } });
  await prisma.tag.create({ data: { name: "wheelchair-accessible" } });
  await prisma.tag.create({ data: { name: "Relaxing" } });
  await prisma.tag.create({ data: { name: "Friendly Neighborhood" } });
  await prisma.tag.create({ data: { name: "Dogs around" } });
  await prisma.tag.create({ data: { name: "illuminated at night" } });
  await prisma.tag.create({ data: { name: "sheltered" } });

  // Meets
  const meet1 = await prisma.meet.create({
    data: {
      date: new Date("2024-08-29"),
      time: "14:00",
      duration: 2,
      isPublic: false,
      creatorId: user1.id,
      participants: { connect: [{ id: user2.id }, { id: user3.id }] },
      groupSize: 2,
      notes: "Freundliches Basketballspiel",
      tags: { connect: [{ name: "Relaxing" }] },
      venueId: weisseElster.id,
      activityTypeId: basketball.id,
      competitive: true,
      mode: "softie",
      isRecurring: false,
    },
  });

  const meet2 = await prisma.meet.create({
    data: {
      date: new Date("2024-09-20"),
      time: "10:00",
      duration: 1,
      isPublic: true,
      creatorId: user2.id,
      participants: { connect: [{ id: user1.id }] },
      groupSize: 1,
      notes: "Tennistraining",
      tags: { connect: [{ name: "Relaxing" }] },
      venueId: beachClubCossi.id,
      activityTypeId: tennis.id,
      mode: "softie",
      address: "Beach Club Cossi",
    },
  });
  // 2
  await prisma.meet.create({
    data: {
      date: new Date("2024-09-20"),
      time: "10:00",
      duration: 3,
      isPublic: false,
      creatorId: user2.id,
      participants: { connect: [{ id: user1.id }, { id: user2.id }] },
      groupSize: 3,
      notes: "juhu boule",
      tags: { connect: [{ name: "Relaxing" }] },
      venueId: bouleBahnBerlin.id,
      activityTypeId: boule.id,
      address: "Leiser Weg 2 in 1621 Leipzig",
      mode: "casual",
    },
  });
  //  3
  await prisma.meet.create({
    data: {
      date: new Date("2024-09-20"),
      time: "20:00",
      duration: 1,
      isPublic: true,
      creatorId: user2.id,
      participants: { connect: [{ id: user1.id }] },
      groupSize: 1,
      notes: "yogimogi",
      tags: { connect: [{ name: "Relaxing" }] },
      venueId: musselGym.id,
      activityTypeId: yoga.id,
      address: "FCKAFD-Weg 2 in 161 Leipzig",
      mode: "softie",
    },
  });
  // 5
  await prisma.meet.create({
    data: {
      date: new Date("2024-09-20"),
      time: "10:00",
      duration: 1,
      isPublic: true,
      creatorId: user2.id,
      participants: { connect: [{ id: user1.id }, { id: user2.id }] },
      groupSize: 3,
      notes: "spontaneous tennis",
      tags: { connect: [{ name: "Relaxing" }] },
      activityTypeId: tennis.id,
      location: [51.328261109658, 12.361901700496],
      address: "Lauter Weg 3 in 1621 Leipzig",
      mode: "softie",
    },
  });
  // 6
  await prisma.meet.create({
    data: {
      date: new Date("2024-08-20"),
      time: "20:00",
      duration: 1,
      isPublic: true,
      creatorId: user2.id,
      participants: { connect: [{ id: user1.id }] },
      groupSize: 1,
      notes: "yogimogi2",
      tags: { connect: [{ name: "Relaxing" }] },
      activityTypeId: yoga.id,
      location: [51.312818371408, 12.379196584224],
      address: "Lieber Weg 13 in 16221 Leipzig",
      mode: "softie",
    },
  });
  // 7
  await prisma.meet.create({
    data: {
      date: new Date("2024-09-20"),
      time: "20:00",
      duration: 1,
      isPublic: true,
      creatorId: user2.id,
      participants: { connect: [{ id: user1.id }] },
      groupSize: 1,
      notes: "free&competitiveboule",
      tags: { connect: [{ name: "Relaxing" }] },
      activityTypeId: boule.id,
      location: [51.333365079861, 12.402499616146],
      address: "Roeckelstraße 2, 1621 Leipzig",
      mode: "softie",
    },
  });
  // 8
  await prisma.meet.create({
    data: {
      date: new Date("2024-09-21"),
      time: "11:00",
      duration: 4,
      isPublic: true,
      creatorId: user2.id,
      participants: { connect: [{ id: user1.id }, { id: user2.id }] },
      groupSize: 5,
      notes: "ballintomorrow",
      tags: { connect: [{ name: "Relaxing" }] },
      activityTypeId: basketball.id,
      location: [51.298389433094, 12.3746411875],
      address: "Zionstraße 13, 1621 Leipzig",
      mode: "casual",
    },
  });
  // 9
  await prisma.meet.create({
    data: {
      date: new Date("2024-09-20"),
      time: "11:00",
      duration: 4,
      isPublic: true,
      creatorId: user2.id,
      participants: { connect: [{ id: user1.id }, { id: user2.id }] },
      groupSize: 5,
      notes: "ballineasily",
      tags: { connect: [{ name: "Relaxing" }] },
      activityTypeId: basketball.id,
      location: [51.333132141369, 12.335911095141],
      competitive: false,
      address: "Ballalala 12 in 161 Leipzig",
      mode: "softie",
    },
  });

  // Meets
  await prisma.meet.create({
    data: {
      date: new Date("2024-09-15"),
      time: "14:00",
      duration: 2,
      isPublic: false,
      creatorId: user1.id,
      participants: { connect: [{ id: user2.id }, { id: user3.id }] },
      groupSize: 2,
      notes: "Freundliches Basketballspiel",
      tags: { connect: [{ name: "Relaxing" }] },
      venueId: weisseElster.id,
      activityTypeId: basketball.id,
      isRecurring: false,
      address: "Brandstraße 2, 1621 Leipzig",
      mode: "softie",
    },
  });
  // 10
  await prisma.meet.create({
    data: {
      date: new Date("2024-09-20"),
      time: "10:00",
      duration: 1,
      isPublic: true,
      creatorId: user2.id,
      participants: { connect: [{ id: user1.id }] },
      groupSize: 2,
      notes: "Tennistraining",
      tags: { connect: [{ name: "Relaxing" }] },
      venueId: beachClubCossi.id,
      activityTypeId: tennis.id,
      competitive: false,
      isRecurring: false,
      mode: "softie",
    },
  });

  await prisma.meet.create({
    data: {
      date: new Date("2024-09-18"),
      time: "11:00",
      duration: 3,
      isPublic: false,
      creatorId: user3.id,
      participants: { connect: [{ id: user1.id }, { id: user2.id }] },
      groupSize: 2,
      notes: "Tennistraining",
      tags: { connect: [{ name: "Relaxing" }] },
      venueId: beachClubCossi.id,
      activityTypeId: tennis.id,
      isRecurring: false,
      address: "Kurt-Eisner-Straße 2, 1621 Leipzig",
      mode: "competitive",
    },
  });
  // 11
  await prisma.meet.create({
    data: {
      date: new Date("2024-10-03"),
      time: "16:00",
      duration: 2,
      isPublic: true,
      creatorId: user1.id,
      participants: { connect: [{ id: user2.id }, { id: user3.id }] },
      groupSize: 2,
      notes: "Freundliches Basketballspiel",
      tags: { connect: [{ name: "Relaxing" }] },
      venueId: weisseElster.id,
      activityTypeId: basketball.id,
      competitive: false,
      mode: "softie",
      isRecurring: false,
    },
  });

  await prisma.meet.create({
    data: {
      date: new Date("2024-09-12"),
      time: "14:00",
      duration: 2,
      isPublic: false,
      creatorId: user2.id,
      participants: { connect: [{ id: user3.id }] },
      groupSize: 2,
      notes: "Freundliches Basketballspiel",
      tags: { connect: [{ name: "Relaxing" }] },
      venueId: musselGym.id,
      activityTypeId: tennis.id,
      competitive: false,
      isRecurring: false,
      address: "Roeckelstraße 21, 1621 Leipzig",
      mode: "casual",
    },
  });

  // Badges
  await prisma.badge.create({
    data: {
      name: "Anzeigenhauptmeister",
      icon: "/parkverbot.png",
      description: "Filed 10 reports",
      users: {
        connect: {
          id: user2.id,
        },
      },
    },
  });

  await prisma.badge.create({
    data: {
      name: "Turniersieger",
      icon: "/gold.svg",
      description: "won 10 sessions",
      users: {
        connect: {
          id: user1.id,
        },
      },
    },
  });

  await prisma.badge.create({
    data: {
      name: "Yoga-Meister",
      icon: "/yoga.svg",
      description: "attended 100 yoga meets",
      users: {
        connect: {
          id: user3.id,
        },
      },
    },
  });

  // Reports
  await prisma.report.create({
    data: {
      issue: "Defekte Ausrüstung",
      date: new Date("2024-08-10"),
      time: "16:30",
      detail: "Der Basketballkorb ist beschädigt und muss repariert werden",
      venueId: weisseElster.id,
    },
  });

  // ... (create other reports similarly)

  // Responses
  console.log("Creating responses...");

  await prisma.response.create({
    data: {
      meetId: meet1.id,
      userId: user2.id,
      status: "accepted",
    },
  });

  await prisma.response.create({
    data: {
      meetId: meet2.id,
      userId: user1.id,
      status: "pending",
    },
  });

  // ... (create other responses similarly)

  console.log("Seed-Daten erfolgreich eingefügt");
}

// getting an error message for await main
// Top-level 'await' expressions are only allowed when the 'module' option is set to 'es2022', 'esnext', 'system', 'node16', 'nodenext', or 'preserve', and the 'target' option is set to 'es2017' or higher.ts(1378)

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
