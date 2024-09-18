"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Filter from "@/components/Filter";
import { Filters } from "@/lib/utils/types";
import { ActivityType } from "@prisma/client";


// const activities = [
//   "tennis",
//   "table tennis",
//   "basketball",
//   "volleyball",
//   "yoga",
//   "boule",
//   "chess",
//   "boxing",
//   "badminton",
// ];

// type FilterDrawerProps = {
//   onFiltersApplied: (filters: Filters) => void;
// };

export function FilterDrawer({ activities }: { activities: ActivityType[] }) {
  const router = useRouter();
  const [activity, setActivity] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [mode, setMode] = useState<string | undefined>("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  function addFilters() {
    const filters: Filters = {};
    if (activity) {
      filters.activity = activity;
    }
    if (status) {
      filters.status = status;
    }

    if (mode) {
      filters.mode = mode;
    }

    return filters;
  }

  const filteredFilters = addFilters();

  const queryString = new URLSearchParams(filteredFilters).toString();
  const url = `/?${queryString}`;

  function resetFilters() {
    setActivity(undefined);
    setStatus(undefined);
    setMode(undefined);

    router.push("/");
    //  window.location.href = "/";
  }

  // function handleApplyFilters() {
  //   router.push(url);
  //   window.location.href = fullUrl;
  // }

  async function handleApplyFilters() {
    // Construct the full URL with the query parameters
    const fullUrl = `${window.location.origin}${url}`;

    // Force a page reload with the updated URL

    window.location.href = fullUrl;
  }
  return (
    <>
      <Drawer>
        <DrawerTrigger>
          <Filter />
        </DrawerTrigger>
        <DrawerContent className="z-[9998]">
          <DrawerHeader>
            <DrawerTitle>Filter</DrawerTitle>
            <DrawerDescription className="sr-only">
              This needs to be here
            </DrawerDescription>
          </DrawerHeader>
          <div className="m-3 flex flex-col gap-4 mb-10">
            <h2>Activity</h2>
            <Select onValueChange={setActivity} onOpenChange={setIsSelectOpen}>
              <SelectTrigger className="text-base">
                <SelectValue placeholder="All Activities" />
              </SelectTrigger>
              <SelectContent className="bg-white p-3 z-[9999] pointer-events-auto">
                <SelectGroup>
                  {activities.map((activity) => (
                    <SelectItem
                      className="text-base"
                      key={activity.id}
                      value={activity.name}
                    >
                      {activity.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* Competetive/Casual/Softie */}
            <div className="text-base flex justify-between items-center gap-1">
              <Select onValueChange={setMode} onOpenChange={setIsSelectOpen}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue className="text-base" placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-white p-3 z-[9999] pointer-events-auto">
                  <SelectItem className="text-base" value="softie">
                    Softie
                  </SelectItem>
                  <SelectItem className="text-base" value="casual">
                    Casual
                  </SelectItem>
                  <SelectItem className="text-base" value="competitive">
                    Competitive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <h2>Status</h2>
            <RadioGroup
              defaultValue="option-one"
              disabled={isSelectOpen}
              // className={` flex justify-between ${
              //   isSelectOpen ? "hidden" : ""
              // } `}
              className="flex justify-between"
              onValueChange={setStatus}
            >
              <div className="flex flex-col w-1/2 pr-5 gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="free" className="text-base">
                    Free
                  </Label>
                  <RadioGroupItem value="free" id="free" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="joinNow" className="text-base">
                    Join now
                  </Label>
                  <RadioGroupItem value="joinNow" id="joinNow" />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-1/2 pr-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="joinTooday" className="text-base">
                    Join today
                  </Label>
                  <RadioGroupItem value="joinToday" id="joinToday" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="occupied" className="text-base">
                    Occupied
                  </Label>
                  <RadioGroupItem value="occupied" id="occupied" />
                </div>
              </div>
            </RadioGroup>
          </div>
          <DrawerFooter>
            <div className="flex gap-10">
              <DrawerClose asChild>
                <Button onClick={handleApplyFilters} disabled={isSelectOpen}>
                  Apply Filters
                </Button>
              </DrawerClose>
              <Button onClick={resetFilters} disabled={isSelectOpen}>
                Reset
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
