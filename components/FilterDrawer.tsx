"use client";
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaFilter } from "react-icons/fa";
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

const activities = [
  "Table Tennis",
  "Basketball",
  "Volleyball",
  "Boule",
  "Chess",
  "Boxing",
  "Badminton",
];
export function FilterDrawer() {
  return (
    <>
      <Drawer>
        <DrawerTrigger>
          {""}
          <FaFilter className="w-6 h-6 m-4" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filter</DrawerTitle>
            <DrawerDescription className="sr-only">
              This needs to be here
            </DrawerDescription>
          </DrawerHeader>
          <div className="m-3 flex flex-col gap-4 mb-10">
            <h2>Activity</h2>
            <Select>
              <SelectTrigger className="text-base">
                <SelectValue placeholder="all activities" />
              </SelectTrigger>
              <SelectContent className="bg-white p-3 z-[1001]">
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
            <div className="flex justify-between mr-8">
              <div className="flex gap-3 ">
                <h2>Competitive</h2>
                <Switch />
              </div>
              <div className="flex gap-3 ">
                <h2>Tournament</h2>
                <Switch />
              </div>
            </div>
            <div className="flex gap-7 ">
              <h2>Recurring</h2>
              <Switch />
            </div>
          </div>
          <DrawerFooter>
            <div className="h-10"></div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
