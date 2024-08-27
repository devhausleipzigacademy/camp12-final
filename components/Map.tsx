"use client";
import { LatLngExpression, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { ReactNode, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import data from "@/lib/output_data.json";
import { VenuePin } from "./VenuePin";
import ReactDOMServer from "react-dom/server";

// Define the structure of each entry in the data
interface DataEntry {
  geolocation: number[] | null[];
  state?: "intended" | "playing" | "free"; // Optional state property
}

interface MapProps {
  children: ReactNode;
}

export function Map({ children }: MapProps) {
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
          setLocation([51.3397, 12.3731]); // Default location
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

          {data.map((entry: DataEntry, index: number) => (
            <Marker
              key={index}
              position={[
                entry.geolocation[0] === null ? 0 : entry.geolocation[0],
                entry.geolocation[1] === null ? 0 : entry.geolocation[1],
              ]}
              icon={divIcon({
                className: "custom-icon",
                html: ReactDOMServer.renderToString(
                  <VenuePin state={entry.state} /> // If `state` is undefined, VenuePin defaults to white
                ),
                iconSize: [24, 24], // Size of your icon
                iconAnchor: [12, 24], // Point of the icon which will correspond to marker's location
              })}
            />
          ))}
        </MapContainer>
        <div className="absolute top-4 right-4 z-[1000]">{children}</div>
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
