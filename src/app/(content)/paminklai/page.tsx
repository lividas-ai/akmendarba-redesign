import type { Metadata } from "next";
import { ServiceDetail } from "@/components/content/akmendarba/service-detail";
import { akmendarbaServices } from "@/content/akmendarba";

export const metadata: Metadata = {
  title: "Paminklai ir paminklų gamyba",
  description: "Granito paminklų projektavimas, gamyba ir montavimas Šiauliuose bei visoje Lietuvoje.",
};

export default function MonumentsPage() {
  return <ServiceDetail service={akmendarbaServices[0]} />;
}
