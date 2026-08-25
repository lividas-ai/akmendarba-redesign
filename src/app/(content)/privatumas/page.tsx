import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/page-chrome";

export const metadata: Metadata = {
  title: "Privatumo informacija · projektas",
  description: "Granit Decor svetainės privatumo informacijos projektas, laukiantis kliento ir teisinio patvirtinimo.",
  robots: { index: false, follow: false },
};

export default function PrivacyDraftPage() {
  return (
    <article className="legal-page content-shell">
      <Breadcrumbs items={[{ label: "Privatumas" }]} />
      <header>
        <span className="legal-page__status">Projektas · nepublikuoti be peržiūros</span>
        <h1>Privatumo informacija</h1>
        <p>
          Šis tekstas parengtas demonstracinei svetainės versijai. Prieš paleidimą jį turi peržiūrėti klientas ir privatumo teisės specialistas, patvirtinęs faktinius duomenų srautus, tiekėjus bei saugojimo terminus.
        </p>
      </header>

      <div className="legal-page__body">
        <section>
          <h2>Duomenų valdytojas</h2>
          <p>
            Duomenų valdytojas: „Granit Decor“ juridinis pavadinimas, įmonės kodas ir registracijos adresas — <strong>[PATVIRTINTI SU KLIENTU]</strong>. Kontaktinis el. paštas: stone@granitdecor.lt — <strong>[PATVIRTINTI PRIEŠ PALEIDIMĄ]</strong>.
          </p>
        </section>

        <section>
          <h2>Ką daro ši demonstracinė versija</h2>
          <p>
            Kontaktų puslapio demonstracinė forma duomenų į serverį nesiunčia ir jų neišsaugo. Paspaudus pateikimo mygtuką, naršyklėje tik parodoma vietinė santrauka. Jei forma bus prijungta prie el. pašto, CRM ar kitos sistemos, šį dokumentą būtina atnaujinti prieš paleidimą.
          </p>
        </section>

        <section>
          <h2>Naršyklėje saugomi pasirinkimai</h2>
          <p>
            Svetainė gali jūsų įrenginio naršyklėje išsaugoti pasirinktą šviesią ar tamsią temą ir išsisaugotų akmens variantų sąrašą. Šie duomenys naudojami tik sąsajos būsenai atkurti tame įrenginyje ir demonstracinėje versijoje nėra siunčiami „Granit Decor“.
          </p>
        </section>

        <section>
          <h2>Užklausos telefonu ar el. paštu</h2>
          <p>
            Susisiekus tiesiogiai, gali būti tvarkomi jūsų pateikti kontaktiniai duomenys ir projekto informacija atsakymo bei galimo bendradarbiavimo tikslu. Teisinis pagrindas, saugojimo terminas, prieigos gavėjai ir duomenų subjektų teisių įgyvendinimo tvarka — <strong>[PATVIRTINTI SU TEISININKU]</strong>.
          </p>
        </section>

        <section>
          <h2>Analitika, slapukai ir išoriniai tiekėjai</h2>
          <p>
            Demonstracinėje versijoje analitikos ir reklamos priemonės nėra aprašytos. Prieš diegiant analitiką, slapukų valdymą, žemėlapio įterpinį, šlamšto apsaugą ar kitą trečiosios šalies paslaugą, būtina įvertinti duomenų perdavimą, sutikimo poreikį ir atnaujinti šią informaciją.
          </p>
        </section>

        <section>
          <h2>Jūsų teisės</h2>
          <p>
            Galutinėje politikoje turi būti aiškiai paaiškintos taikomos teisės: susipažinti su duomenimis, juos ištaisyti ar ištrinti, apriboti tvarkymą, nesutikti su tvarkymu, perkelti duomenis, atšaukti sutikimą ir pateikti skundą priežiūros institucijai. Tiksli formuluotė priklauso nuo patvirtintų duomenų tvarkymo veiklų.
          </p>
        </section>

        <section>
          <h2>Versija ir pakeitimai</h2>
          <p>
            Įsigaliojimo data ir dokumento versija — <strong>[ĮRAŠYTI PO TEISINĖS PERŽIŪROS]</strong>. Politika turi būti atnaujinama pasikeitus svetainei, tiekėjams ar duomenų tvarkymo tikslams.
          </p>
        </section>
      </div>
    </article>
  );
}
