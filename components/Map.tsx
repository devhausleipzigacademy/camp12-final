import React, { useRef, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { Venue } from "@/lib/utils/types";
import { GetVenuesResult } from "@/app/api/data-acces/get-venues";
import { GetOpenMeetsResult } from "@/app/api/data-acces/get-open-meets";
import jsonData from "../lib/filtered_output_data.json";
import { CrosshairIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { GiCrosshair } from "react-icons/gi";

export interface VenueData {
  name: string;
  address: string;
  distance?: string;
  geolocation: LatLngExpression;
}

type MapProps = {
  openDrawer: (venueData: VenueData) => void;
  venues: GetVenuesResult;
  openMeets: GetOpenMeetsResult;
  isDrawerOpen: boolean;
  crossVisible: boolean;
  close: () => void;
  updateCrossPos: (pos: LatLngExpression) => void;
};

const venueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const meetIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Map2({
  openDrawer,
  venues,
  openMeets,
  isDrawerOpen,
  crossVisible,
  updateCrossPos,
  close,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userPosition, setUserPosition] = useState<LatLngExpression | null>(
    null
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = L.map(mapContainer.current, {
      center: [51.3397, 12.3731],
      zoom: 12,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: false,
    });

    new MaptilerLayer({
      apiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY,
    }).addTo(map.current);

    const VenueMarkers = L.markerClusterGroup();
    const OpenMeetMarkers = L.markerClusterGroup();

    venues.forEach((venue) => {
      if (venue.location && venue.location.length === 2) {
        const marker = L.marker(venue.location as L.LatLngTuple, {
          icon: venueIcon,
        })
          .bindPopup(venue.name || "Unnamed Venue")
          .on("click", () => {
            const venueData: VenueData = {
              name: venue.name || "Unnamed Venue",
              address: venue.address || "Unknown address",
              geolocation: venue.location as LatLngExpression,
            };
            openDrawer(venueData);
          });

        VenueMarkers.addLayer(marker);
      }
    });
    map.current.addLayer(VenueMarkers);

    openMeets.forEach((meet) => {
      if (meet.location && meet.location.length === 2) {
        const marker = L.marker(meet.location as L.LatLngTuple, {
          icon: meetIcon,
        })
          .bindPopup("Meet: " + meet.activityType.name)
          .on("click", () => {
            const venueData: VenueData = {
              name: meet.activityType.name || "Unnamed Meet",
              address: meet.address || "Unknown address",
              geolocation: meet.location as LatLngExpression,
            };
            openDrawer(venueData);
          });
        OpenMeetMarkers.addLayer(marker);
      }
    });
    map.current.addLayer(OpenMeetMarkers);

    setLoading(false);
  }, [venues, openMeets, openDrawer, isDrawerOpen]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos: LatLngExpression = [latitude, longitude];
          setUserPosition(userPos);
          setLoading(false);
          if (map.current) {
            map.current.setView(userPos, 13);
            L.marker(userPos, { icon: meetIcon })
              .addTo(map.current)
              .bindPopup("You are here");
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
          setUserPosition([51.3397, 12.3731]);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      setLoading(false);
    }
  }, [venues]);

  useEffect(() => {
    if (map.current && crossVisible && userPosition) {
      // Center the map on the user's location if crossVisible is true
      map.current.setView(userPosition, 13);
    }
  }, [crossVisible, userPosition]);

  return (
    <div ref={mapContainer} className="h-screen w-screen absolute">
      {crossVisible && (
        <div className="absolute top-1/2 left-1/2 z-[999] -translate-x-1/2 -translate-y-1/2">
          <GiCrosshair className="size-20" />
        </div>
      )}
      {crossVisible && (
        <div className="bg-white rounded-t-3xl p-4 pb-8 border-border z-[1000] absolute bottom-0 inset-x-0">
          <div className="flex justify-end mb-4">
            <Button onClick={close} size="icon" variant="ghost">
              <XIcon className="size-5" />
            </Button>
          </div>
          <div className="flex gap-4">
            <Button className="flex-1">Create Meet</Button>
            <Button className="flex-1">Create Venue</Button>
          </div>
        </div>
      )}
    </div>
  );
}
