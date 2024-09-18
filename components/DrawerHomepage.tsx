import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { InteractionBar } from "./InteractionBar";
import { VenueData } from "./Map"; // Import the type

type DrawerProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  venueData: VenueData | null; // Add venue data to be displayed
};

export function DrawerHompage({ isOpen, setIsOpen, venueData }: DrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{venueData?.name || "Venue Information"}</DrawerTitle>
          <DrawerDescription>
            {venueData?.address || "No address available"}
          </DrawerDescription>
          <div className="relative m-auto mb-5">
            <p className="text-sm text-slate-700">
              Distance: {venueData?.distance || "Unknown distance"}
            </p>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <InteractionBar venueData={venueData} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
