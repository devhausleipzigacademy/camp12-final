"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { addParticipant } from "@/actions/response";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
interface ResponseInteractionProps {
  meetId: string;
  userId: string;
}

export default function ResponseInteraction({
  meetId,
  userId,
}: ResponseInteractionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const result = await addParticipant(meetId, userId);
      if (result.success) {
        router.push(`/meet/${meetId}`);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Failed to add participant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col w-full justify-center px-5 pb-5">
      {!userId && (
        <Input
          className=" mt-10"
          placeholder="Your Name"
          //value={participantName}
          //onChange={(e) => setParticipantName(e.target.value)}
        />
      )}
      <div className="flex gap-5 mt-5">
        <Button
          variant="destructive"
          className="flex-grow"
          onClick={handleDecline}
          disabled={isLoading}
        >
          Decline
        </Button>
        <Button
          variant="default"
          className="flex-grow"
          //disabled={isLoading || (!userId && !participantName.trim())}
          onClick={handleAccept}
        >
          {isLoading ? "Adding..." : "Accept"}
        </Button>
      </div>
    </div>
  );
}
