import type { Metadata } from "next";
import { ServiceDetail } from "@/components/content/akmendarba/service-detail";
import { akmendarbaServices } from "@/content/akmendarba";

export const metadata: Metadata = {
  title: "Kapo dengimai",
  description: "Kapo dengimų iš granito plokščių gamyba ir montavimas Šiauliuose bei visoje Lietuvoje.",
};

export default function GraveCoveringsPage() {
  return <ServiceDetail service={akmendarbaServices[1]} />;
}
