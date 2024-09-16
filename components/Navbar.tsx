"use client";

import Link from "next/link";
import { FaCirclePlus, FaUser } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { DrawerUpComingSessions } from "./DrawerUpComingSessions";
import { UserCreatedMeet, UserParticipatingMeet } from "@/lib/utils/getMeets";
import { cn } from "@/lib/utils";
import { FaTableTennis } from "react-icons/fa";

type NavbarProps = {
  userCreatedMeets: UserCreatedMeet[];
  userPariticpatingMeets: UserParticipatingMeet[];
  isDrawerOpen: boolean;
  toggleCross: () => void;
  toggleDrawer: () => void;
  centerMapOnUser: () => void; // Add this function to center the map on the user
};

const Navbar: React.FC<NavbarProps> = ({
  userCreatedMeets,
  userPariticpatingMeets,
  isDrawerOpen,
  toggleCross,
  toggleDrawer,
  centerMapOnUser, // Use this to center the map
}) => {
  return (
    <div
      className={cn(
        "w-full fixed bottom-0 flex justify-between p-4 text-3xl bg-white text-primary items-center z-[1000]" // Ensure high z-index so it stays above the map
      )}
    >
      <FaTableTennis
        onClick={toggleDrawer}
        className={cn(
          "cursor-pointer",
          isDrawerOpen ? "text-primary" : "text-gray-400"
        )}
      />
      <FaLocationCrosshairs
        className="cursor-pointer text-gray-400"
        onClick={centerMapOnUser} // Center map on user location when clicked
      />
      <Link href={"/create-meet"}>
        <FaCirclePlus className="cursor-pointer text-gray-400" />
      </Link>
      <Link href={"/profile"}>
        <FaUser className="cursor-pointer text-gray-400" />
      </Link>
    </div>
  );
};

export default Navbar;
