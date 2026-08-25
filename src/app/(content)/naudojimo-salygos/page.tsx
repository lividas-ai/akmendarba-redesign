import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/page-chrome";

export const metadata: Metadata = {
  title: "Naudojimo sąlygos · projektas",
  description: "Granit Decor svetainės naudojimo sąlygų projektas, laukiantis kliento ir teisinio patvirtinimo.",
  robots: { index: false, follow: false },
};

export default function TermsDraftPage() {
  return (
    <article className="legal-page content-shell">
      <Breadcrumbs items={[{ label: "Naudojimo sąlygos" }]} />
      <header>
        <span className="legal-page__status">Projektas · reikalinga teisinė peržiūra</span>
        <h1>Svetainės naudojimo sąlygos</h1>
        <p>
          Šios sąlygos yra demonstracinis turinio projektas. Jos nėra galutinė sutartis ar teisinė konsultacija. Prieš paskelbiant būtina patvirtinti juridinius duomenis, paslaugų užsakymo eigą, atsakomybės ribas ir taikomą teisę.
        </p>
      </header>

      <div className="legal-page__body">
        <section>
          <h2>Svetainės paskirtis</h2>
          <p>
            Svetainėje pristatomos natūralaus akmens medžiagos, galimos gaminių kryptys, viešo darbų archyvo vaizdai ir bendro pobūdžio informacija. Svetainės turinys savaime nėra individualus techninis pasiūlymas, garantija ar sutartis.
          </p>
        </section>

        <section>
          <h2>Natūralaus akmens vaizdas</h2>
          <p>
            Natūralaus akmens plokštės gali skirtis raštu, tonu ir mineralinėmis detalėmis. Ekrano nuotrauka ar mažas pavyzdys negali garantuoti tikslaus galutinio gaminio vaizdo. Konkreti plokštė ir jos išdėstymas turi būti derinami projekte.
          </p>
        </section>

        <section>
          <h2>Tinkamumas ir priežiūra</h2>
          <p>
            Medžiagos tinkamumas priklauso nuo akmens rūšies, paviršiaus apdailos, gaminio konstrukcijos, naudojimo vietos ir priežiūros. Bendro pobūdžio svetainės tekstas nepakeičia konkretaus projekto vertinimo ar pasirinktos medžiagos instrukcijos.
          </p>
        </section>

        <section>
          <h2>Užklausos ir pasiūlymai</h2>
          <p>
            Demonstracinė forma užklausų nesiunčia. Galutinėje svetainėje turi būti aiškiai aprašyta, kada užklausa laikoma gauta, kokia informacija reikalinga pasiūlymui ir kada susitarimas tampa privalomas — <strong>[PATVIRTINTI SU KLIENTU IR TEISININKU]</strong>.
          </p>
        </section>

        <section>
          <h2>Darbų archyvas ir autorinės teisės</h2>
          <p>
            Archyvo vaizdams nepublikuojami nepatvirtinti medžiagų pavadinimai, objektų vietos, datos ar dalyviai. Prieš paleidimą būtina patvirtinti nuotraukų naudojimo teises, autorystės nurodymus ir leidimus viešinti objektus. Svetainės tekstų, vaizdų ir ženklo naudojimo taisyklės — <strong>[PATVIRTINTI]</strong>.
          </p>
        </section>

        <section>
          <h2>Išorinės nuorodos</h2>
          <p>
            Svetainėje gali būti nuorodų į išorines paslaugas, pavyzdžiui, žemėlapį. Jų turinį ir privatumo praktiką valdo atitinkami paslaugų teikėjai. Galutinę formuluotę reikia suderinti su faktiškai naudojamomis integracijomis.
          </p>
        </section>

        <section>
          <h2>Taikoma teisė ir ginčai</h2>
          <p>
            Taikomos teisės, vartotojų informavimo, ginčų sprendimo ir kompetentingų institucijų nuostatos — <strong>[ĮRAŠYTI PO TEISINĖS PERŽIŪROS]</strong>.
          </p>
        </section>

        <section>
          <h2>Versija</h2>
          <p>
            Sąlygų įsigaliojimo data, versija ir atsakingo juridinio asmens rekvizitai — <strong>[PATVIRTINTI PRIEŠ PALEIDIMĄ]</strong>.
          </p>
        </section>
      </div>
    </article>
  );
}
