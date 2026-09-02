import type { Metadata } from "next";
import { MaterialExplorer } from "@/components/materials/material-explorer";

export const metadata: Metadata = {
  title: "Granito ir marmuro pasirinkimas",
  description:
    "Peržiūrėkite Akmendarba viešai pristatomas granito ir marmuro kryptis, išsaugokite pasirinkimą ir palyginkite abu šaltinio vaizdus.",
};

export default function MaterialsPage() {
  return <MaterialExplorer />;
}
