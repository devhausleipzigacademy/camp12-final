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
// import { Button } from "./ui/button";

const userId = "234";
const meets = [
  {
    title: "Pingpong",
    address: "Erich Zeigner Allee",
    date: "28.08.2024",
    time: "3:00 PM",
    img: "../public/DolliBu-Wild-Elephant-Unicorn-Plush-Stuffed-Animal-Toy-Super-Soft-Elephantcorn-Dress-Up-Removable-Outfit-Cute-Fantasy-Wildlife-Gift-12-Inch_b81bd1b7-ab9c-47a4-b273-8899acf69d63.3a2eef36493668f5b4e5d133e2559c3b.webp",
    creatorId: "234",
  },

  {
    title: "Pingpong",
    address: "Erich Zeigner Allee",
    date: "30:08.2024",
    img: "../public/DolliBu-Wild-Elephant-Unicorn-Plush-Stuffed-Animal-Toy-Super-Soft-Elephantcorn-Dress-Up-Removable-Outfit-Cute-Fantasy-Wildlife-Gift-12-Inch_b81bd1b7-ab9c-47a4-b273-8899acf69d63.3a2eef36493668f5b4e5d133e2559c3b.webp",
    creatorId: "234",
  },

  {
    title: "Pingpong",
    address: "Erich Zeigner Allee",
    date: "31:08.2024",
    img: "../public/DolliBu-Wild-Elephant-Unicorn-Plush-Stuffed-Animal-Toy-Super-Soft-Elephantcorn-Dress-Up-Removable-Outfit-Cute-Fantasy-Wildlife-Gift-12-Inch_b81bd1b7-ab9c-47a4-b273-8899acf69d63.3a2eef36493668f5b4e5d133e2559c3b.webp",
    creatorId: "123",
  },
];

// const tournaments = [
//   {
//     title: "Pingpong",
//     address: "Erich Zeigner Allee",
//     date: "29:08.2024",
//     img: "../public/DolliBu-Wild-Elephant-Unicorn-Plush-Stuffed-Animal-Toy-Super-Soft-Elephantcorn-Dress-Up-Removable-Outfit-Cute-Fantasy-Wildlife-Gift-12-Inch_b81bd1b7-ab9c-47a4-b273-8899acf69d63.3a2eef36493668f5b4e5d133e2559c3b.webp",
//     creatorId: "123",
//   },
//   {
//     title: "Hide & Seek",
//     address: "Behind Bushes",
//     date: "29:08.2024",
//     img: "../public/DolliBu-Wild-Elephant-Unicorn-Plush-Stuffed-Animal-Toy-Super-Soft-Elephantcorn-Dress-Up-Removable-Outfit-Cute-Fantasy-Wildlife-Gift-12-Inch_b81bd1b7-ab9c-47a4-b273-8899acf69d63.3a2eef36493668f5b4e5d133e2559c3b.webp",
//     creatorId: "234",
//   },
// ];

type Meet = {
  title: string;
  address: string;
  date: string;
  img: string;
  creatorId: string;
  time: string;
};

type DrawerUpComingSessionsProps = {
  meets: Meet[];
  userId: string;
};

export function DrawerUpComingSessions() {
  const filteredData = [...meets];

  const renderCard = (item: Meet, key: number) => (
    <Card key={key}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Date: {item.date}</p>
        {item.time && <p>Time: {item.time}</p>}
        <img src={item.img} alt={item.title} />
      </CardContent>
    </Card>
  );

  const nearMe = filteredData
    .filter((item) => item.address === "Erich Zeigner Allee")
    .map(renderCard);

  const ownMeets = filteredData
    .filter((item) => item.creatorId === userId)
    .map(renderCard);

  const renderEmptyState = (message: string) => <p>{message}</p>;

  const nearMeContent =
    nearMe.length > 0 ? nearMe : renderEmptyState("No nearby events found.");
  const ownMeetsContent =
    ownMeets.length > 0
      ? ownMeets
      : renderEmptyState("No events organized by you.");

  return (
    <Drawer>
      <DrawerTrigger>
        <FaTableTennis className="size-8 fill-white" />
      </DrawerTrigger>
      <DrawerContent className="z-[9999] h-[calc(100vh-16vh)] flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="sr-only">Upcoming sessions</DrawerTitle>
          <DrawerDescription className="sr-only">
            You can see the upcoming sessions here: the ones near you, the ones
            you organized, and tournaments.
          </DrawerDescription>
        </DrawerHeader>
        <Tabs
          defaultValue="near-me"
          className="w-[350px] flex flex-col flex-1 mt-4 max-h-full"
        >
          <TabsList className="flex justify-center">
            <TabsTrigger className="flex-1" value="near-me">
              Near me
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="own-meets">
              Own meets
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="near-me"
            className="px-4 py-2 flex-1 overflow-y-scroll max-h-[350px]"
          >
            {nearMeContent}
          </TabsContent>
          <TabsContent
            value="own-meets"
            className="px-4 py-2 flex-1 overflow-y-scroll max-h-[350px]"
          >
            {ownMeetsContent}
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
