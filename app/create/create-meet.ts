import type { NextApiRequest, NextApiResponse } from "next";
import { createMeet } from "@/actions/meet";
import { prisma } from "@/lib/db";

export default async function meetHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      activityType,
      mode,
      public: isPublic,
      date,
      time,
      duration,
      guests,
      notes,
      venueId,
      creatorId, // is it passed from client?
    } = req.body;

    try {
      const activityTypeRecord = await prisma.activityType.findUnique({
        where: { name: activityType },
      });

      if (!activityTypeRecord) {
        return res
          .status(400)
          .json({ message: `ActivityType "${activityType}" not found` });
      }

      await createMeet({
        date: new Date(date),
        time,
        duration,
        mode,
        isPublic,
        creatorId,
        guests,
        notes,
        venueId,
        activityTypeId: activityTypeRecord.id,
      });

      res.status(200).json({ message: "Meet created successfully" });
    } catch (error) {
      console.error("failed to create meet:", error);
      res.status(500).json({ message: "Failed to create meet" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
