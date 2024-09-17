import WeekDayItem from "./weekDayItem";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import * as React from "react";

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const denominator = ["Day", "Week", "Month", "Year"];

export default function RecurrenceForm() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="z-10 w-auto h-1/2 bg-white p-4 border-black border-2 rounded-lg flex flex-col gap-2">
      <h1 className="font-bold text-xl text-center">Recurrence settings</h1>
      <div className="flex flex-row gap-2 items-center justify-between">
        <p>repeat every</p>
        <div className="flex flex-row gap-2">
          <Input
            type="recurrence_numerator"
            placeholder="1"
            className="w-12 h-8 text-right"
          />
          <Select>
            <SelectTrigger className="w-24 h-8">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {denominator.map((item, index) => (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="px-2">on</p>
        </div>
      </div>
      <div className="flex flex-row gap-1 align-center justify-between">
        {weekdays.map((day, index) => {
          return <WeekDayItem key={index} text={day} />;
        })}
      </div>
      <p className="my-2">and end</p>
      <RadioGroup defaultValue="never" className="text-lg flex flex-col gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="never" id="never" />
          <Label htmlFor="never">Never</Label>
        </div>

        <div className="flex flex-row justify-between  ">
          <div className="flex space-x-2 items-center">
            <RadioGroupItem value="at" id="at" />
            <Label htmlFor="at">At</Label>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-52 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center space-x-2 flex-row justify-between  ">
          <div className="flex space-x-2 items-center">
            <RadioGroupItem value="after" id="after" />
            <Label htmlFor="after">After</Label>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-52 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </RadioGroup>

      <Button type="submit" className="w-2/3 self-center mt-4">
        Save
      </Button>
    </div>
  );
}
