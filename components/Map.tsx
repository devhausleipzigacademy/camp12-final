import { GetOpenMeetsResult } from "@/app/api/data-acces/get-open-meets";
import { GetVenuesResult } from "@/app/api/data-acces/get-venues";
import { MapLibreTileLayer } from "@/lib/utils/map/MapTileLayer";
import L, { LatLngExpression } from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";
import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { GiCrosshair } from "react-icons/gi";
import { MapContainer } from "react-leaflet";
import { Button } from "./ui/button";
import { MapMarkers } from "./MapMarkers";

export interface VenueData {
  id: string;
  name: string;
  address: string;
  distance?: string;
  geolocation: LatLngExpression;
}

type MapProps = {
  openDrawer: (venueData: VenueData) => void;
  venues: GetVenuesResult;
  openMeets: GetOpenMeetsResult;
  isDrawerOpen: boolean; // Add this prop
  crossVisible: boolean;
  close: () => void;
  updateCrossPos: (pos: LatLngExpression) => void;
  handleCreateMeet: () => void;
  handleCreateVenue: () => void;
};

export default function Map2({
  openDrawer,
  venues,
  openMeets,
  isDrawerOpen,
  crossVisible,
  updateCrossPos,
  close,
  handleCreateMeet,
  handleCreateVenue,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <MapContainer
      center={[51.3397, 12.3731]}
      zoom={12}
      maxZoom={18}
      scrollWheelZoom={true}
      zoomControl={false}
      className="w-screen h-screen relative"
      attributionControl={false}
    >
      <MapMarkers
        isDrawerOpen={isDrawerOpen}
        openDrawer={openDrawer}
        openMeets={openMeets}
        setLoading={setLoading}
        updateCrossPos={updateCrossPos}
        venues={venues}
      />
      <MapLibreTileLayer
        style=""
        attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        url="https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_col.json"
      />
      {crossVisible ? (
        <div className="absolute  top-1/2 left-1/2 z-[999] -translate-x-1/2 -translate-y-1/2">
          <GiCrosshair className="size-20" />
        </div>
      ) : null}
      {crossVisible ? (
        <div className="bg-white rounded-t-3xl p-4 pb-8 border-border z-[1000] absolute bottom-0 inset-x-0">
          <div className="flex justify-end mb-4">
            <Button onClick={close} size="icon" variant="ghost">
              <XIcon className="size-5" />
            </Button>
          </div>
          <div className="flex gap-4">
            <Button className="flex-1" onClick={handleCreateMeet}>
              Create Meet
            </Button>
            <Button className="flex-1" onClick={handleCreateVenue}>
              Create Venue
            </Button>
          </div>
        </div>
      ) : null}
    </MapContainer>
  );
}
