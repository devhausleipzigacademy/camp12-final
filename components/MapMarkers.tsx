import L, { LatLngExpression, map } from "leaflet";
import { Venue } from "@/lib/utils/types";
import { useRef, useEffect, useState } from "react";
import { VenueData } from "./Map";
import { useMap } from "react-leaflet";
import { GetVenuesResult } from "@/app/api/data-acces/get-venues";
import { GetOpenMeetsResult } from "@/app/api/data-acces/get-open-meets";
import jsonData from "../lib/filtered_output_data.json";

type Props = {
  updateCrossPos: (pos: LatLngExpression) => void;
  venues: GetVenuesResult;
  openMeets: GetOpenMeetsResult;
  openDrawer: (venueData: VenueData) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isDrawerOpen: boolean;
};

export function MapMarkers({
  updateCrossPos,
  venues,
  openMeets,
  openDrawer,
  setLoading,
  isDrawerOpen,
}: Props) {
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

  const map = useMap();
  const [userPosition, setUserPosition] = useState<LatLngExpression | null>(
    null
  );
  const userPositionRef = useRef<LatLngExpression | null>(null);

  useEffect(() => {
    userPositionRef.current = userPosition;
  }, [userPosition]);

  useEffect(() => {
    try {
      map.on("moveend", () => {
        if (map) {
          const center = map.getCenter();
          updateCrossPos([center.lat, center.lng]);
        }
      });

      // new MaptilerLayer({
      //   apiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY,
      // }).addTo(map.current);

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
        } else {
          console.log("Invalid location for:", venue.name);
        }
      });
      map.addLayer(VenueMarkers);

      console.log(openMeets);

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
      map.addLayer(OpenMeetMarkers);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing map:", error);
      setLoading(false);
    }
  }, [venues, openMeets, openDrawer, isDrawerOpen, updateCrossPos]); // Add isDrawerOpen to dependencies

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos: LatLngExpression = [latitude, longitude];
          setUserPosition(userPos);
          setLoading(false);
          if (map) {
            map.setView(userPos, 13);
            L.marker(userPos).addTo(map).bindPopup("You are here");
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
    if (!map) return;

    function handleClick() {
      if (userPositionRef.current) {
        const nearestVenue = getNearestVenue(userPositionRef.current, venues);
        if (nearestVenue) {
          const distance = calculateDistance(
            userPositionRef.current,
            nearestVenue
          );
          const distanceFormatted = (distance / 1000).toFixed(2) + " km"; // Format distance as kilometers
          map.flyTo(nearestVenue, 16);
          const venueData: VenueData = {
            name: "Closest Venue",
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
  return null;
}

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 * @param point1 - The first geographical point (latitude, longitude).
 * @param point2 - The second geographical point (latitude, longitude).
 * @returns The distance in meters between the two points.
 */
function calculateDistance(
  point1: LatLngExpression,
  point2: LatLngExpression
): number {
  // Type assertion to treat point1 and point2 as [number, number]
  const [lat1, lon1] = point1 as [number, number];
  const [lat2, lon2] = point2 as [number, number];

  const R = 6371e3; // Earth's radius in meters
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const deltaLatRad = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLonRad = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLonRad / 2) *
      Math.sin(deltaLonRad / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
function getNearestVenue(
  userLocation: LatLngExpression,
  venues: Venue[]
): LatLngExpression | null {
  const userLoc = userLocation as [number, number];
  let result: LatLngExpression = userLocation;
  let minDistance = Infinity;

  for (let key in jsonData) {
    const venueLoc: [number, number] = jsonData[key].geolocation as [
      number,
      number
    ];
    if (!venueLoc) continue;

    venues.forEach((venue) => {
      if (venue.location && venue.location.length === 2) {
        const venueLoc: [number, number] = venue.location as [number, number];

        const distance = Math.sqrt(
          Math.pow(userLoc[0] - venueLoc[0], 2) +
            Math.pow(userLoc[1] - venueLoc[1], 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          result = venueLoc;
        }
      }
    });
  }
  return result;
}
