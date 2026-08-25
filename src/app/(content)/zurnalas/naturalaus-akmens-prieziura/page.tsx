import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs, EditorialCta } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Natūralaus akmens priežiūra",
  description:
    "Praktinė natūralaus akmens paviršių priežiūros pradžia: kasdienis valymas, dėmių ir rūgščių rizika, impregnavimas ir kada kreiptis į specialistą.",
};

export default function StoneCareArticle() {
  return (
    <>
      <article className="journal-article">
        <header className="journal-article__header content-shell">
          <Breadcrumbs items={[{ label: "Žurnalas", href: "/zurnalas" }, { label: "Natūralaus akmens priežiūra" }]} />
          <Reveal className="journal-article__title" y={18}>
            <h1>Kaip prižiūrėti natūralų akmenį.</h1>
            <p>
              Priežiūra priklauso nuo akmens rūšies, apdailos ir naudojimo vietos. Pirmiausia išsiaiškinkite, koks tai paviršius ir kokios priemonės jam tinka.
            </p>
          </Reveal>
          <div className="journal-article__meta">
            <span>Praktinis gidas</span>
            <span>Taikyti kartu su konkretaus paviršiaus instrukcija</span>
          </div>
        </header>

        <Reveal className="journal-article__hero" y={14}>
          <figure className="page-shell" data-ratio="classic">
            <Image src="/assets/portfolio/vonios-baldai-stalvirsiai-dvylika.webp" alt="Natūralaus akmens paviršius Granit Decor įrengtoje vonios erdvėje." fill loading="eager" priority sizes="100vw" />
            <figcaption>Granit Decor darbų archyvas · paviršiaus detalė</figcaption>
          </figure>
        </Reveal>

        <div className="journal-article__layout content-shell">
          <aside className="journal-article__aside" aria-label="Straipsnio turinys">
            <span>Turinys</span>
            <a href="#kasdien">Kasdienė priežiūra</a>
            <a href="#ko-vengti">Ko vengti</a>
            <a href="#impregnavimas">Impregnavimas</a>
            <a href="#demes">Dėmės ir pažeidimai</a>
          </aside>

          <div className="journal-article__body">
            <Reveal>
              <p className="journal-article__lead">
                Pradėkite nuo švelniausio tinkamo metodo. Neleiskite skysčiams įsigerti, o naują priemonę pirmiausia išbandykite mažame, nepastebimame plote.
              </p>
            </Reveal>

            <section id="kasdien">
              <Reveal>
                <h2>Kasdienė priežiūra</h2>
                <p>
                  Dulkes ir trupinius nuvalykite minkšta šluoste. Kasdieniam valymui dažniausiai pakanka šilto vandens ir gerai išgręžtos minkštos šluostės. Jei reikia valiklio, rinkitės konkrečiam akmeniui tinkamą neutralaus pH priemonę ir laikykitės jos instrukcijos.
                </p>
                <ul>
                  <li>Išsiliejusį skystį pirmiausia sugerkite, o ne paskleiskite per didesnį plotą.</li>
                  <li>Po valymo nepalikite priemonės likučių ir nusausinkite paviršių.</li>
                  <li>Atskirkite kasdienį valymą nuo dėmių šalinimo — tai gali būti skirtingos užduotys.</li>
                </ul>
              </Reveal>
            </section>

            <aside className="journal-article__callout">
              <span>Svarbu</span>
              <p>
                Marmuras ir travertinas priklauso rūgštims jautrių karbonatinių akmenų grupei. Actas, citrinų rūgštis ir rūgštiniai vonios valikliai gali paveikti jų paviršių. Nežinodami akmens rūšies, rūgštinių priemonių nenaudokite.
              </p>
            </aside>

            <section id="ko-vengti">
              <Reveal>
                <h2>Ko geriau vengti</h2>
                <p>
                  Stipri universali priemonė netinka visoms akmens rūšims. Abrazyvūs milteliai, šiurkščios kempinės ir nepatikrinti kalkių ar rūdžių valikliai gali pakeisti paviršiaus blizgesį arba palikti žymę.
                </p>
                <dl>
                  <div>
                    <dt>Rūgštiniai valikliai</dt>
                    <dd>Ypač rizikingi marmurui, travertinui ir kitiems rūgštims jautriems akmenims.</dd>
                  </div>
                  <div>
                    <dt>Abrazyvai</dt>
                    <dd>Gali pakeisti poliruoto ar kitaip apdoroto paviršiaus išvaizdą.</dd>
                  </div>
                  <div>
                    <dt>Neaiškūs „universalūs“ mišiniai</dt>
                    <dd>Naudokite tik žinodami, kad priemonė tinka būtent jūsų akmeniui ir apdailai.</dd>
                  </div>
                </dl>
              </Reveal>
            </section>

            <section id="impregnavimas">
              <Reveal>
                <h2>Impregnavimas nėra vienodas grafikas visiems</h2>
                <p>
                  Impregnavimo poreikis priklauso nuo akmens, apdailos, naudojimo intensyvumo ir anksčiau naudoto produkto. Vieno grafiko visiems paviršiams nėra. Dėl pakartotinio impregnavimo pasitarkite su gaminio tiekėju ar akmens specialistu ir vadovaukitės konkretaus produkto instrukcija.
                </p>
              </Reveal>
            </section>

            <section id="demes">
              <Reveal>
                <h2>Dėmė, patamsėjimas ar matinė žymė — ne tas pats</h2>
                <p>
                  Pirmiausia nustatykite, ar akmuo sugėrė skystį, ar cheminė priemonė paveikė paviršių, ar atsirado mechaninis įbrėžimas. Skirtingoms priežastims reikia skirtingo sprendimo. Jei žymė lieka po švelnaus valymo, nenaudokite stipresnių mišinių — parodykite ją specialistui.
                </p>
              </Reveal>
            </section>

            <Reveal className="journal-article__closing">
              <h2>Trumpa atmintinė</h2>
              <ol>
                <li>Žinokite akmens rūšį ir paviršiaus apdailą.</li>
                <li>Skysčius sugerkite kuo greičiau.</li>
                <li>Pradėkite nuo švelnaus, konkrečiam akmeniui tinkamo metodo.</li>
                <li>Neaiškią žymę pirmiausia identifikuokite, tik tada valykite.</li>
              </ol>
            </Reveal>
          </div>
        </div>
      </article>

      <EditorialCta
        title="Nežinote akmens rūšies ar apdailos?"
        body="Atsiųskite paviršiaus nuotrauką ir turimą informaciją. Įvertinsime, ar klausimą galima spręsti nuotoliu."
        actionLabel="Užduoti klausimą"
        actionHref="/kontaktai"
        secondaryLabel="Kitas gidas"
        secondaryHref="/zurnalas/kaip-rinktis-virtuves-stalvirsi"
      />
    </>
  );
}
