/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/nFV6pk7Xp8l
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfileUpdatePage() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-4">
      <div className="w-full max-w-sm bg-white rounded-lg p-6 flex flex-col items-center justify-between flex-grow">
        <div className="flex justify-between w-full mb-6">
          <Link
            href="/profile/friends"
            className="flex items-center text-black hover:text-gray-700"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
          </Link>
          <Button variant="default">Apply Changes</Button>
        </div>
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 mb-2">
            <AvatarImage
              className="rounded-lg"
              src="/profileImg.png"
              alt="Profile Photo"
            />
            <AvatarFallback>ProfileImg</AvatarFallback>
          </Avatar>
          <Button variant="ghost">Change Photo</Button>
        </div>
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="block font-bold">
              Name
            </Label>
            <Input id="name" placeholder="Name" className="w-full" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption" className="block">
              Caption
            </Label>
            <Textarea
              id="caption"
              placeholder="Caption"
              className="w-full resize-none h-20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="competitor" />
            <Label htmlFor="competitor">I am a serious competitor</Label>
          </div>
          <div>
            <Select>
              <SelectTrigger id="player-level">
                <SelectValue placeholder="Player Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="advanced">Club</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
