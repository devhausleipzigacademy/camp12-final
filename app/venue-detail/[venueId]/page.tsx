import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import DisplayWeather from "@/components/display-weather";
import Back from "@/components/Back";
import { LuMapPin, LuAlertTriangle, LuLock } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import TagsBadges from "@/components/TagsBadges";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function VenueDetailsPage({
  params,
}: {
  params: { venueId?: string };
}) {
  const venue = await prisma.venue.findUnique({
    where: { id: params.venueId },
    select: {
      name: true,
      location: true,
      image: true,
      address: true,
      description: true,
      tags: {
        select: { name: true },
      },
      meets: {
        select: {
          id: true,
          date: true,
          time: true,
          isPublic: true,
        },
      },
      reports: {
        select: {
          issue: true,
          detail: true,
        },
      },
    },
  });

  console.log(venue);

  // handle an undefined case
  const coordinates: number[] | undefined = venue?.location;
  let address: string;
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    const [lat, lng] = coordinates;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }
    const data = await response.json();
    address = data.display_name;
  } else {
    throw new Error("The coordinates are undefined or in wrong format");
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="relative h-2/5">
        <Back className="absolute top-4 left-4 z-10" />
        <img
          className="w-full h-full object-cover"
          src={venue?.image || "/signin-hero.jpg"}
          alt={venue?.name || "Venue image"}
        />
      </div>
      <main className="flex flex-col h-3/5 bg-white rounded-t-3xl -mt-6 relative z-10 overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col gap-4 py-6">
            <div className="flex flex-col gap-1 px-5">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">{venue?.name}</h1>
                <DisplayWeather
                  lat={coordinates?.[0] || 0}
                  lon={coordinates?.[1] || 0}
                />
              </div>
              <div className="flex gap-1">
                <LuMapPin className="size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground ">{address}</p>
              </div>
            </div>
            <Separator />
            <div className="px-5">
              {venue?.reports.map((report, index) => (
                <Alert
                  key={index}
                  variant="destructive"
                  className="bg-red-100 px-5"
                >
                  <LuAlertTriangle className="h-4 w-4" />
                  <AlertTitle>{report.issue}</AlertTitle>
                  <AlertDescription>{report.detail}</AlertDescription>
                </Alert>
              ))}
            </div>

            <div className="px-5">
              <TagsBadges tags={venue.tags} />
              <div className="-mt-">
                <label htmlFor="description" className="font-semibold">
                  About the venue
                </label>
                <p className="text-muted-foreground">{venue?.description}</p>
              </div>

              <div className="mt-4">
                <label htmlFor="meets" className="font-semibold">
                  Sessions
                </label>
                <div className="flex flex-col gap-2 w-full">
                  {venue?.meets.map((meet) => (
                    <Link href={`/meet/${meet.id}`} key={meet.id}>
                      <Card className="px-5 py-3 mt-2 relative w-full hover:bg-gray-50 transition-colors">
                        {!meet.isPublic && (
                          <div className="absolute top-3 right-5 flex items-center text-gray-400">
                            <Label className="mr-1">Private</Label>
                            <LuLock className="h-4 w-4" />
                          </div>
                        )}
                        <CardContent className="px-0 py-0">
                          <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row gap-4">
                              <div>
                                <Label className="text-gray-500">Date</Label>
                                <p>
                                  {new Date(meet.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <Label className="text-gray-500">Time</Label>
                                <p>{meet.time}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-5">
          <Button className="w-full font-medium text-white rounded-lg py-4">
            Create Session
          </Button>
        </div>
      </main>
    </div>
  );
}
