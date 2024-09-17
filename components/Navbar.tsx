"use client";

import Link from "next/link";
import { FaCirclePlus, FaUser } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { DrawerUpComingSessions } from "./DrawerUpComingSessions";
import { UserCreatedMeet, UserParticipatingMeet } from "@/lib/utils/getMeets";
import { cn } from "@/lib/utils";
import { FaTableTennis } from "react-icons/fa";

type Props = {
  userCreatedMeets: UserCreatedMeet[];
  userPariticpatingMeets: UserParticipatingMeet[];
  isDrawerOpen: boolean;
  toggleCross: () => void;
  toggleCenter: () => void; // New prop for centering the map
};

export default function Navbar({
  userCreatedMeets,
  userPariticpatingMeets,
  isDrawerOpen,
  toggleCross,
  toggleCenter, // Add the centerMapOnUser function
}: Props) {
  return (
    <nav
      // Use the cn function to merge classes conditionally
      className={cn(
        "rounded-3xl absolute z-[999] bottom-4 right-4 left-4 p-5 bg-zinc-800/80 justify-between items-center",
        isDrawerOpen ? "hidden" : "flex" // This class is conditionally applied when isDrawerOpen is true
      )}
    >
      {/* Drawer for Upcoming Sessions */}
      <DrawerUpComingSessions defaultTab="near-me">
        <FaTableTennis className="size-8 fill-white" />
      </DrawerUpComingSessions>

      {/* Crosshair Icon that triggers centering the map */}
      <FaLocationCrosshairs
        className="size-8 fill-white cursor-pointer"
        onClick={toggleCenter} // Call the centerMapOnUser function when this is clicked
      />

      {/* Create Meet button */}
      <button onClick={toggleCross}>
        <FaCirclePlus className="size-8 fill-white" />
      </button>

      {/* Link to the user's profile */}
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
