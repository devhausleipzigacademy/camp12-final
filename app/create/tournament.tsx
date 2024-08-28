"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Venue hardcoded

const venue = "Clara-Zetkin-Park";

// Defining a schema for Tournament Creation
const formSchema = z.object({
  activityType: z.enum(["pingpong", "basketball"], {
    required_error: "Choose a Sport",
  }),
  mode: z.enum(["softie", "casual", "competetive"], {
    required_error: "Choose a Mode",
  }),
  // tournamentType: z.enum(["single", "round"], {
  //   required_error: "Choose a tournament type",
  // }),
  public: z.boolean(),
  date: z.date({ required_error: "Date is required" }),
  time: z.string({ required_error: "Time is required" }),
  duration: z.number(),
  participants: z.coerce
    .number({
      invalid_type_error:
        "Please enter a number of people, you'd like to play with",
    })
    .positive({ message: "this👏is👏too👏low" }),
  competetive: z.boolean(),
  recurring: z.boolean(),
  equipment: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export default function CreateSession() {
  // Calender Popover open
  const [isOpen, setIsOpen] = useState(false);

  // Setting up React Hook Form with Zod resolver for validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: 0.5,
      public: false,
      competetive: false,
      recurring: false,
      date: new Date(),
      time: "12:00",
      description: "",
      equipment: "",
    },
  });

  // Custom hook to subscribe to field change and isolate re-rendering at the component level.
  const duration = useWatch({
    control: form.control,
    name: "duration",
    defaultValue: 0.5,
  });
  const privacy = useWatch({
    control: form.control,
    name: "public",
    defaultValue: false,
  });

  const date = useWatch({
    control: form.control,
    name: "date",
  });
  const time = useWatch({
    control: form.control,
    name: "time",
  });

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  // Handling form submission
  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("SUBMITTED", data);
    // Shadcn Sonner pop up message
    toast.success(
      `Meeting at: ${format(data.date, "dd MMM yyyy")} ${data.time}`
    );
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full my-6 flex flex-col items-center"
        >
          <div>
            <div className="flex flex-col gap-4 items-center">
              <h2 className="text-xl font-bold pb-3">Create a Session</h2>
              <span className="pb-6"> @ {venue}</span>
              {/* Activity Type */}
              <FormField
                control={form.control}
                name="activityType"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Username</FormLabel> */}
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Activity Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pingpong">Ping Pong</SelectItem>
                          <SelectItem value="basketball">Basketball</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Level */}
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="softie">Softie</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="competetive">
                            Competetive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Date and Time */}
              <div className="flex gap-2">
                {/* Date */}
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? (
                          `${format(date, "PPP")}`
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={date}
                      onSelect={(selectedDate) => {
                        form.setValue("date", selectedDate ?? new Date());
                      }}
                      onDayClick={() => setIsOpen(false)}
                      fromYear={new Date().getFullYear()}
                      toYear={new Date().getFullYear() + 1}
                      disabled={(date) =>
                        Number(date) < Date.now() - 1000 * 60 * 60 * 24 ||
                        Number(date) > Date.now() + 1000 * 60 * 60 * 24 * 30
                      }
                    />
                  </PopoverContent>
                </Popover>
                {/* Time */}
                <Select
                  defaultValue={time!}
                  onValueChange={(e) => {
                    form.setValue("time", e);
                  }}
                >
                  <SelectTrigger className="font-normal focus:ring-0 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[15rem]">
                      {Array.from({ length: 48 }).map((_, i) => {
                        const hour = Math.floor(i / 2)
                          .toString()
                          .padStart(2, "0");
                        const minute = ((i % 2) * 30)
                          .toString()
                          .padStart(2, "0");
                        return (
                          <SelectItem key={i} value={`${hour}:${minute}`}>
                            {hour}:{minute}
                          </SelectItem>
                        );
                      })}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
              {/* Duration */}
              <span className="font-bold">Duration: {duration} hours</span>
              <div>
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(values) => {
                            field.onChange(values[0]);
                          }}
                          min={0.5}
                          max={3}
                          step={0.5}
                          className="w-[270px]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Privacy */}
              <FormField
                control={form.control}
                name="public"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-6">
                        <span
                          className={cn(
                            !privacy
                              ? "text-black font-bold"
                              : "text-muted-foreground"
                          )}
                        >
                          Private
                        </span>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span
                          className={cn(
                            privacy === true
                              ? "text-black font-bold"
                              : "text-muted-foreground"
                          )}
                        >
                          Public
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Participants */}
              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Number of participants" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Competetive */}
              <FormField
                control={form.control}
                name="competetive"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-4">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span
                          className={cn(
                            field.value === true
                              ? "text-black font-bold"
                              : "text-muted-foreground"
                          )}
                        >
                          Competetive
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Recurring */}
              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-4">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span
                          className={cn(
                            field.value === true
                              ? "text-black font-bold"
                              : "text-muted-foreground"
                          )}
                        >
                          Recurring
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Equipment */}
              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What equipment is needed?"
                        {...field}
                        className="w-[270px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add more Details"
                        {...field}
                        className="w-[270px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit" className="w-2/3">
            Create
          </Button>
        </form>
      </Form>
    </>
  );
}
