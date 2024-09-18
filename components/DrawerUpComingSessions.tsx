import React, { useState, useEffect } from "react";
import { FaTableTennis } from "react-icons/fa";
import { InteractionBar } from "./InteractionBar";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import { AllMeet, getAllMeets } from "@/lib/utils/getMeets";
import { Meet, User } from "@prisma/client";

type ExtendedMeet = AllMeet & { distance?: number };

export function DrawerUpComingSessions({
  children,
  defaultTab,
  meets,
  user,
}: {
  children: React.ReactNode;
  defaultTab: string;
  meets: AllMeet[];
  user: User;
}) {
  const [sortedMeets, setSortedMeets] = useState<ExtendedMeet[]>([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        const meetsWithDistance = meets.map((meet) => {
          let meetLocation =
            meet.location || (meet.venue && meet.venue.location);
          let distance = Infinity;

          if (meetLocation) {
            distance = Math.sqrt(
              Math.pow(latitude - meetLocation[0], 2) +
                Math.pow(longitude - meetLocation[1], 2)
            );
          }

          return {
            ...meet,
            distance: distance,
          };
        });

        const sorted = meetsWithDistance.sort(
          (a, b) => a.distance - b.distance
        );
        setSortedMeets(sorted);
      });
    }
  }, [meets]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderCard = (item: ExtendedMeet, key: number) => (
    <Card key={key}>
      <CardHeader>
        <CardTitle>{item.venue ? item.venue.name : "No Venue"}</CardTitle>
        <CardDescription>{item.notes}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Date: {formatDate(item.date)}</p>
        {item.time && <p>time: {item.time}</p>}
        {/* {item.distance !== undefined && (
          <p>
            Entfernung:{" "}
            {item.distance === Infinity
              ? "Unbekannt"
              : `${item.distance.toFixed(2)} km`}
          </p>
        )} */}
        <p>
          adress:{" "}
          {item.venue && item.venue.address
            ? item.venue.address
            : "No adress available"}
        </p>
      </CardContent>
    </Card>
  );

  const nearMe = sortedMeets.map(renderCard);

  const ownMeets = sortedMeets.filter((meet) =>
    meet.participants.some((participant) => participant.id === user?.id)
  );

  const renderEmptyState = (message: string) => <p>{message}</p>;

  const nearMeContent =
    nearMe.length > 0
      ? nearMe
      : renderEmptyState("No venues found in the area");

  const ownMeetsContent =
    ownMeets.length > 0
      ? ownMeets.map(renderCard)
      : renderEmptyState("you are not participating in any meets");

  return (
    <Drawer>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent className="z-[9999] h-[calc(100vh-16vh)] flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="sr-only">Upcoming meets</DrawerTitle>
          <DrawerDescription className="sr-only">
            Hier sehen Sie die bevorstehenden Sitzungen: die in Ihrer Nähe und
            die, die Sie organisiert haben.
          </DrawerDescription>
        </DrawerHeader>
        <Tabs
          defaultValue={defaultTab}
          className="w-[350px] flex flex-col flex-1 mt-4 max-h-full"
        >
          <TabsList className="flex justify-center">
            <TabsTrigger className="flex-1" value="near-me">
              Near me
            </TabsTrigger>
            {user ? (
              <TabsTrigger className="flex-1" value="own-meets">
                Own meets
              </TabsTrigger>
            ) : null}
          </TabsList>
          <TabsContent
            value="near-me"
            className="px-4 py-2 flex-1 overflow-y-scroll max-h-[350px]"
          >
            {nearMeContent}
          </TabsContent>
          {user ? (
            <TabsContent
              value="own-meets"
              className="px-4 py-2 flex-1 overflow-y-scroll max-h-[350px]"
            >
              {ownMeetsContent}
            </TabsContent>
          ) : null}
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
