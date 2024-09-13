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
  isDrawerOpen: boolean; // Add this prop
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

// Define the red icon for the user pin
const userLocationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png", // Red pin icon for user location
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
  const userPositionRef = useRef<LatLngExpression | null>(null);

  useEffect(() => {
    userPositionRef.current = userPosition;
  }, [userPosition]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      // Initialize the map
      map.current = L.map(mapContainer.current, {
        center: [51.3397, 12.3731], // Default center
        zoom: 12,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: false,
      });

      // Update crosshair position when the map stops moving
      map.current.on("moveend", () => {
        if (map.current) {
          const center = map.current.getCenter();
          updateCrossPos([center.lat, center.lng]);
        }
      });

      new MaptilerLayer({
        apiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY,
      }).addTo(map.current);

      const VenueMarkers = L.markerClusterGroup();
      const OpenMeetMarkers = L.markerClusterGroup();

      // Loop through venues and add them to the map
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
        } else {
          console.log("Invalid location for:", venue.name);
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
          VenueMarkers.addLayer(marker);
        } else {
          console.log("Invalid location for:", meet.activityType.name);
        }
      });
      map.current.addLayer(OpenMeetMarkers);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setLoading(false);
    }
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
            // Center the map on the user position
            map.current.setView(userPos, 13);

            // Add a red pin at the user's location
            L.marker(userPos, { icon: userLocationIcon }) // Use the orange icon for the user's location
              .addTo(map.current)
              .bindPopup("You are here")
              .openPopup();
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
          setUserPosition([51.3397, 12.3731]); // Default location if user location is unavailable
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
    if (!map.current) return;

    function handleClick() {
      if (userPositionRef.current) {
        const nearestVenue = getNearestVenue(userPositionRef.current, venues);
        if (nearestVenue) {
          const distance = calculateDistance(
            userPositionRef.current,
            nearestVenue
          );
          const distanceFormatted = (distance / 1000).toFixed(2) + " km"; // Format distance as kilometers
          map.current?.flyTo(nearestVenue, 16);
          const venueData: VenueData = {
            name: "Nearest Venue",
            address: "Some Address",
            distance: distanceFormatted,
            geolocation: nearestVenue,
          };
          setTimeout(() => openDrawer(venueData), 1500);
        }
      } else {
        console.error("User position is not available");
      }
    }
  }, [venues, openDrawer]);

  return (
    <div ref={mapContainer} className="h-screen w-screen absolute">
      {crossVisible ? (
        <div className="absolute top-1/2 left-1/2 z-[999] -translate-x-1/2 -translate-y-1/2">
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
            <Button className="flex-1">Create Meet</Button>
            <Button className="flex-1">Create Venue</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Function to calculate the distance between two points using the Haversine formula
function calculateDistance(
  userLocation: LatLngExpression,
  venueLocation: LatLngExpression
): number {
  const [lat1, lon1] = getLatLng(userLocation);
  const [lat2, lon2] = getLatLng(venueLocation);

  const R = 6371000; // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Helper function to extract latitude and longitude from LatLngExpression
function getLatLng(location: LatLngExpression): [number, number] {
  if (Array.isArray(location)) {
    // If it's a tuple (array), ensure it's exactly [number, number]
    const [lat, lng] = location; // Extract the first two elements
    return [lat, lng];
  } else if (location instanceof L.LatLng) {
    // If it's a LatLng object, extract lat and lng
    return [location.lat, location.lng];
  }
  throw new Error("Invalid LatLngExpression");
}

// Function to get the nearest venue to the user location
function getNearestVenue(
  userLocation: LatLngExpression,
  venues: GetVenuesResult
): LatLngExpression | null {
  let nearestVenue: LatLngExpression | null = null;
  let minDistance = Infinity;

  venues.forEach((venue) => {
    if (venue.location && venue.location.length === 2) {
      const distance = calculateDistance(
        userLocation,
        venue.location as LatLngExpression
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestVenue = venue.location as LatLngExpression;
      }
    }
  });

  return nearestVenue;
}
