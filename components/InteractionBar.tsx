import { useRouter } from "next/router";
import { FiFlag, FiPlusCircle, FiInfo } from "react-icons/fi";
import { VenueData } from "./Map";
import Link from "next/link";
import { getVenues } from "@/app/api/data-acces/get-venues";
type Props = {
  venueData: VenueData | null; // Add venue data to be displayed
};

export function InteractionBar({ venueData }: Props) {

  return (
    <div className="flex w-screen h-auto px-6 py-4 justify-between text-xs font-medium self-end">
      <Link href={`/report-venue?venueId=${venueData?.id}`}>
        <div className="flex flex-col gap-2 items-center">
          <FiFlag className="w-8 h-8" />
          <p>Report</p>
        </div>
      </Link>
      <Link href={`/create-meet?venueId=${venueData?.id}`}>
        <div className="flex flex-col gap-2 items-center">
          <FiPlusCircle className="w-8 h-8" />
          <p>Create Session</p>
        </div>
      </Link>
      <Link href={`/venue-detail/${venueData?.id}`}>
        <div className="flex flex-col gap-2 items-center">
          <FiInfo className="w-8 h-8" />
          <p>Details</p>
        </div>
      </Link>
    </div>
  );
}
