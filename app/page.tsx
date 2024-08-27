import { FilterDrawer } from "@/components/FilterDrawer";
import { DrawerHomepage } from "@/components/DrawerHomepage";
import Navbar from "../components/Navbar";
import { Map } from "@/components/Map";

export default function Home() {
  return (
    <div className="h-screen w-full">
      <Map>
        <FilterDrawer />
      </Map>
      <Map />
      <DrawerHomepage />
      <Navbar />
    </div>
  );
}
