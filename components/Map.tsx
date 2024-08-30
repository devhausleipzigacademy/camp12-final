"use client";
import { LatLngExpression, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { VenuePin } from "./VenuePin";
import ReactDOMServer from "react-dom/server";
import { GetVenuesResult } from "@/app/api/data-access/venues";

// Define the structure of each entry in the data
// interface DataEntry {
//   geolocation: number[] | null[];
//   state?: "intended" | "playing" | "free"; // Optional state property
// }

function parseLocation(locationString: string): [number, number] {
  const [lat, lng] = locationString.split(",").map(Number);
  return [lat || 0, lng || 0];
}
const state = "intended";

type MapProps = {
  venues: GetVenuesResult; // or whatever type your venues array is
};

export function Map({ venues }: MapProps) {
  const [location, setLocation] = useState<LatLngExpression | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
          setLoading(false);
          console.log(`Latitude: ${latitude}, longitude: ${longitude}`);
        },
        (error) => {
          console.error("Error getting User location", error);
          setLocation([52.4926, 13.466]); // Default location
          setLoading(false);
        }
      );
    } else {
      console.error("Geo location is not supported by the browser");
      setLoading(false);
    }
  }, []);

  if (loading) {
    console.log("Waiting for your location");
    setLoading(false);
  }

  if (typeof window !== "undefined" && location !== null && loading === false) {
    return (
      <div>
        <MapContainer
          center={location}
          zoom={13}
          scrollWheelZoom={false}
          className="w-screen h-screen-without-bar"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {venues.map((venue) => (
            <Marker
              key={venue.id}
              position={parseLocation(venue.location)}
              icon={divIcon({
                className: "custom-icon",
                html: ReactDOMServer.renderToString(
                  <VenuePin state={state} /> // If `state` is undefined, VenuePin defaults to white
                ), // This has to come from meet and maybe tournament, but that's for later
                iconSize: [24, 24], // Size of your icon
                iconAnchor: [12, 24], // Point of the icon which will correspond to marker's location
              })}
            />
          ))}
        </MapContainer>
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen-without-bar bg-zinc-300 text-center p-20">
        Loading
      </div>
    );
  }
}
