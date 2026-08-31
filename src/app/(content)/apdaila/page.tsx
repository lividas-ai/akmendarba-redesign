import type { Metadata } from "next";
import { ServiceDetail } from "@/components/content/akmendarba/service-detail";
import { akmendarbaServices } from "@/content/akmendarba";

export const metadata: Metadata = {
  title: "Vidaus ir išorės apdaila",
  description: "Granito plokščių pjovimas, apdirbimas ir pritaikymas vidaus bei išorės apdailai.",
};

export default function FinishPage() {
  return <ServiceDetail service={akmendarbaServices[3]} />;
}
