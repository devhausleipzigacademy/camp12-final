"use client";

import Link from "next/link";
import { useState } from "react";
import { FaTableTennis } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { DrawerUpComingSessions } from "./DrawerUpComingSessions";
import { UserCreatedMeet, UserParticipatingMeet } from "@/lib/utils/getMeets";
import { DrawerCreateVenue } from "./DrawerCreateVenue";

type Props = {
  userCreatedMeets: UserCreatedMeet[];
  userPariticpatingMeets: UserParticipatingMeet[];
  isDrawerOpen: boolean;
};

export default function Navbar({
  userCreatedMeets,
  userPariticpatingMeets,
  isDrawerOpen,
}: Props) {
  return (
    <nav
      className={`flex rounded-3xl absolute z-[999] bottom-4 right-4 left-4 p-5 bg-zinc-800/80 justify-between items-center ${
        isDrawerOpen ? "hidden" : ""
      }`}
    >
      <DrawerUpComingSessions />
      <FaLocationCrosshairs className="size-8 fill-white" />
      <DrawerCreateVenue />
      <Link href="/profile" className="nav-link">
        <div className="nav-button">
          <div className="flex flex-col items-center justify-center">
            <FaUser className="size-8 fill-white" />
          </div>
        </div>
      </Link>
    </nav>
  );
}
