"use client";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

interface Person {
  id: string;
  name: string | null;
  picture: string | null;
}

interface AvatarListProps {
  people: Person[];
  type: "friends" | "participants";
  meetId?: string; // Optional, only needed for participants
}

export default function AvatarList({ people, type, meetId }: AvatarListProps) {
  const maxDisplayed = 5;
  const displayPeople = people.slice(0, maxDisplayed);
  const remainingCount = Math.max(0, people.length - maxDisplayed);

  const getLinkHref = () => {
    if (type === "friends") {
      return "/profile/friends";
    } else if (type === "participants" && meetId) {
      return `/meet/${meetId}/participants`;
    }
    return "#"; // Fallback
  };

  const getAltText = (person: Person, index: number) => {
    return (
      person.name ||
      `${type === "friends" ? "Friend" : "Participant"} ${index + 1}`
    );
  };

  return (
    <div>
      <Separator className="mt-2 mb-5 w-full" />
      <div className="flex justify-between w-full items-center px-5 mb-5">
        <div className="flex">
          {displayPeople.map((person, index) => (
            <Avatar
              key={person.id}
              className={`w-10 h-10 overflow-hidden relative ring-2 ring-white ${
                index !== 0 ? "-ml-2" : ""
              } z-[${10 - index}]`}
            >
              <AvatarImage
                src={person.picture || "/placeholder-user.jpg"}
                alt={getAltText(person, index)}
                className="w-full h-full object-cover"
              />
              <AvatarFallback>{person.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
          ))}
          {remainingCount > 0 && (
            <Avatar className="h-10 w-10 -ml-2 ring-2 ring-white">
              <AvatarFallback>+{remainingCount}</AvatarFallback>
            </Avatar>
          )}
        </div>
        <Link href={getLinkHref()}>
          <LuArrowRight className="size-5" />
        </Link>
      </div>
      <Separator className="my-5" />
    </div>
  );
}
