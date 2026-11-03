import { events } from "@/data/events";
import KatalogInteraktif from "@/components/KatalogInteraktif";

export default function Katalog() {
  return (
    <div>
      <KatalogInteraktif events={events} />
    </div>
  );
}