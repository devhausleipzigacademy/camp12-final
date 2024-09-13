"use client";

import Link from "next/link";
import { FaCirclePlus, FaUser } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { DrawerUpComingSessions } from "./DrawerUpComingSessions";
import { UserCreatedMeet, UserParticipatingMeet } from "@/lib/utils/getMeets";
import { DrawerCreateVenue } from "./DrawerCreateVenue";
import { cn } from "@/lib/utils";
import { FaTableTennis } from "react-icons/fa";

type NavbarProps = {
  userCreatedMeets: UserCreatedMeet[];
  userPariticpatingMeets: UserParticipatingMeet[];
  isDrawerOpen: boolean;
  toggleCross: () => void;
};

export default function Navbar({
  userCreatedMeets,
  userPariticpatingMeets,
  isDrawerOpen,
  toggleCross,
}: NavbarProps) {
  return (
    <nav
      className={cn(
        "rounded-3xl absolute z-[999] bottom-4 right-4 left-4 p-5 bg-zinc-800/80 justify-between items-center",
        isDrawerOpen ? "hidden" : "flex"
      )}
    >
      <DrawerUpComingSessions defaultTab="near-me">
        <FaTableTennis className="size-8 fill-white" />
      </DrawerUpComingSessions>
      <FaLocationCrosshairs className="size-8 fill-white" />
      <button onClick={toggleCross}>
        <FaCirclePlus className="size-8 fill-white" />
      </button>
      <Link href="/profile/me" className="nav-link">
        <div className="nav-button">
          <div className="flex flex-col items-center justify-center">
            <FaUser className="size-8 fill-white" />
          </div>
        </div>
      </Link>
    </nav>
  );
}
