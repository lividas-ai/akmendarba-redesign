import type { Metadata } from "next";
import { ProjectPlanner } from "@/components/planner/project-planner";

export const metadata: Metadata = {
  title: "Projekto planas",
  description:
    "Paruoškite natūralaus akmens projekto informaciją: gaminį, matmenis, norimą medžiagą, vietą ir kontaktus.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProjectPage() {
  return (
    <div className="planner-page">
      <section className="planner-hero content-shell" aria-labelledby="planner-page-title">
        <p className="planner-hero__label">Projekto užklausa</p>
        <div className="planner-hero__copy">
          <h1 id="planner-page-title">Aptarkime jūsų projektą.</h1>
          <p>Pasirinkite gaminį, pateikite matmenis ir pridėkite turimus brėžinius ar nuotraukas.</p>
        </div>
        <p className="planner-hero__note">Šiuo metu forma veikia kaip demonstracija — informacija nėra siunčiama.</p>
      </section>

      <section className="planner-section content-shell" aria-label="Interaktyvus projekto planas">
        <ProjectPlanner />
      </section>
    </div>
  );
}
