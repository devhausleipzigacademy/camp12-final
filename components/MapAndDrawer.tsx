"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { DrawerHompage } from "./DrawerHomepage";
import { GetVenuesResult } from "@/app/api/data-acces/get-venues";
import { GetOpenMeetsResult } from "@/app/api/data-acces/get-open-meets";
import { VenueData } from "./Map"; // Import VenueData type
import Navbar from "./Navbar";
import { UserCreatedMeet, UserParticipatingMeet } from "@/lib/utils/getMeets";
import { LatLngExpression } from "leaflet";

export default function MapAndDrawer({
  venues,
  openMeets,
  userCreatedMeets,
  userPariticpatingMeets,
}: {
  venues: GetVenuesResult;
  openMeets: GetOpenMeetsResult;
  userCreatedMeets: UserCreatedMeet[];
  userPariticpatingMeets: UserParticipatingMeet[];
}) {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => <p className="p-40 text-center">A map is loading</p>,
        ssr: false,
      }),
    []
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueData | null>(null);
  const [crossVisible, setCrossVisible] = useState(false);
  const [crossPos, setCrossPos] = useState<LatLngExpression | null>(null);
const [centerUserOnMap, setCenterUserOnMap] = useState(false);

const toggleCross = () => setCrossVisible((prev) => !prev);
const toggleCenter = () => setCenterUserOnMap((prev) => !prev);
const close = () => setCrossVisible(false);
const updateCrossPos = (pos: LatLngExpression) => setCrossPos(pos);

const openDrawer = (venueData: VenueData) => {
  setSelectedVenue(venueData);
  setIsDrawerOpen(true);
};

return (
  <div>
    <Map
      crossVisible={crossVisible}
      close={close}
      openDrawer={openDrawer}
      venues={venues}
      openMeets={openMeets}
      isDrawerOpen={isDrawerOpen}
      updateCrossPos={updateCrossPos}
      centerUserOnMap={centerUserOnMap}
    />
    <DrawerHompage
      isOpen={isDrawerOpen}
      setIsOpen={setIsDrawerOpen}
      venueData={selectedVenue}
    />
    <Navbar
      userCreatedMeets={userCreatedMeets}
      userPariticpatingMeets={userPariticpatingMeets}
      isDrawerOpen={isDrawerOpen}
      toggleCross={toggleCross}
      toggleCenter={toggleCenter}
    />
  </div>
);
}
