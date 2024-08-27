import { FilterDrawer } from "@/components/FilterDrawer";
import Navbar from "../components/Navbar";
import { Map } from "@/components/Map";

export default function Home() {
  return (
    <div className="h-screen w-full">
      <Map>
        <FilterDrawer />
      </Map>
      <Navbar />
    </div>
  );
}
