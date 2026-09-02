import type { Metadata } from "next";
import { MaterialExplorer } from "@/components/materials/material-explorer";

export const metadata: Metadata = {
  title: "Akmens ir atliktų darbų pasirinkimas",
  description:
    "Peržiūrėkite visus Akmendarba viešai rodomus akmens, gamybos ir atliktų darbų pavyzdžius, išsaugokite pasirinkimus ir palyginkite iki trijų.",
};

export default function MaterialsPage() {
  return <MaterialExplorer />;
}
