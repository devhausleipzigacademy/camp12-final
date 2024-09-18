import { z } from "zod";

export const meetSchema = z.object({
  activityType: z.string().min(1, "Choose a Sport"),
  public: z.boolean(),
  date: z.date({ required_error: "Date is required" }),
  time: z.string({ required_error: "Time is required" }),
  mode: z.enum(["softie", "casual", "competitive"], {
    required_error: "Choose a Mode",
  }),
  duration: z.number(),
  // change participants to guests
  groupSize: z.string(),
  recurring: z.boolean(),
  equipment: z.string().trim().optional(),
  description: z.string().trim().optional(),
  // competitive: z.boolean(),
});
