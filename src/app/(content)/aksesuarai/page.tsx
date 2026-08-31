import type { Metadata } from "next";
import { ServiceDetail } from "@/components/content/akmendarba/service-detail";
import { akmendarbaServices } from "@/content/akmendarba";

export const metadata: Metadata = {
  title: "Akmens aksesuarai",
  description: "Kapo atributikos, individualių užrašų ir vaizdų gamyba Šiauliuose bei visoje Lietuvoje.",
};

export default function AccessoriesPage() {
  return <ServiceDetail service={akmendarbaServices[2]} />;
}
