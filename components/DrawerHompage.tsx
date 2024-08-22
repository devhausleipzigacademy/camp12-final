import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { InteractionBar } from "./InteractionBar";

export function DrawerHompage() {
  return (
    <Drawer>
      <DrawerTrigger>Open drawer for now</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="relative m-auto mb-5">
            <h4 className="absolute text-slate-200 text-xs ml-6 mt-2">
              Erich-Zeigner-Allee 76
            </h4>
            <div className="bg-green-600 h-4 w-4 rounded-full absolute left-80 mr-8 mt-3"></div>
            <img
              src="example.png"
              alt="a picture of a ping pong table"
              className="object-cover flex justify-self-center items-center"
            />
            <div className="absolute top-48 left-7 flex gap-2">
              <small className=" border-2 rounded-full border-slate-500 text-slate-500 pl-2 pr-2 bg-slate-200 bg-opacity-30">
                Condtion
              </small>
              <small className=" border-2 rounded-full border-slate-500 text-slate-500 pl-2 pr-2 bg-slate-200 bg-opacity-30">
                Public
              </small>
            </div>
            <small className="absolute mt-1 left-5 text-slate-700">
              Distance: 300m
            </small>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <InteractionBar />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
