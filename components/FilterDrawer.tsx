"use client";
import {
  Drawer,
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
import { LuFilter } from "react-icons/lu";
import { useRouter } from "next/navigation";

const activities = [
  "tennis",
  "table tennis",
  "basketball",
  "volleyball",
  "yoga",
  "boule",
  "chess",
  "boxing",
  "badminton",
];

type Filters = {
  activity?: string;
  status?: string;
  competitive?: string;
};

type FilterDrawerProps = {
  onFiltersApplied: (filters: Filters) => void;
};

export function FilterDrawer() {
  const router = useRouter();
  const [activity, setActivity] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [excludeCompetitive, setExcludeCompetitive] = useState(true);
  const [isCompetitive, setIsCompetitive] = useState(false);

  function addFilters() {
    const filters: Filters = {};
    if (activity) {
      filters.activity = activity;
    }
    if (status) {
      filters.status = status;
    }
    if (!excludeCompetitive) {
      filters.competitive = isCompetitive.toString();
    }

    return filters;
  }

  const filteredFilters = addFilters();

  const queryString = new URLSearchParams(filteredFilters).toString();
  const url = `/?${queryString}`;

  function resetFilters() {
    setActivity(undefined);
    setStatus(undefined);
    setExcludeCompetitive(true);
    setIsCompetitive(false);

    router.push("/");
  }

  function handleApplyFilters() {
    router.push(url);
  }
  return (
    <>
      <Drawer>
        <DrawerTrigger>
          <div className="flex w-11 h-11 rounded-xl absolute z-[999] top-4 right-4 p-3 bg-white/80 justify-between items-center">
            <LuFilter className="size-8" />
          </div>
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
            <Select onValueChange={setActivity}>
              <SelectTrigger className="text-base">
                <SelectValue placeholder="all activities" />
              </SelectTrigger>
              <SelectContent className="bg-white p-3 z-[9999]">
                <SelectGroup>
                  {activities.map((activity) => (
                    <SelectItem
                      className="text-base"
                      key={activity}
                      value={activity}
                    >
                      {activity}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <h2>Status</h2>
            <RadioGroup
              defaultValue="option-one"
              className="flex justify-between"
              onValueChange={setStatus}
            >
              <div className="flex flex-col w-1/2 pr-10 gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="free" className="text-base">
                    Free
                  </Label>
                  <RadioGroupItem value="free" id="free" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="join" className="text-base">
                    Open to join
                  </Label>
                  <RadioGroupItem value="join" id="join" />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-1/2 pr-10">
                <div className="flex items-center justify-between">
                  <Label htmlFor="planned" className="text-base">
                    Planned
                  </Label>
                  <RadioGroupItem value="planned" id="planned" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="occupied" className="text-base">
                    Occupied
                  </Label>
                  <RadioGroupItem value="occupied" id="occupied" />
                </div>
              </div>
            </RadioGroup>
            <div className="flex justify-between items-center gap-1">
              <h2
                className={`${
                  excludeCompetitive ? "text-muted-foreground" : "text-primary"
                }`}
              >
                Competitive
              </h2>
              <Switch
                onCheckedChange={setIsCompetitive}
                disabled={excludeCompetitive}
              />

              <h2 className="pl-4">show both</h2>
              <Checkbox
                id="excludeCompetitive"
                checked={excludeCompetitive}
                onCheckedChange={(checked) => {
                  setExcludeCompetitive(checked as boolean);
                  if (!checked) {
                    setIsCompetitive(false);
                  }
                }}
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleApplyFilters}>
              <DrawerTrigger>Apply Filters</DrawerTrigger>
            </Button>
            <Button onClick={resetFilters}>Reset</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
