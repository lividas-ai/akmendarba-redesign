import { projects } from "@/client/granit-decor/data/content";
import { portfolioItems, type PortfolioItem } from "@/client/granit-decor/data/portfolio-gallery";

type ProjectId = (typeof projects)[number]["id"];

export type ProjectThemeImage = Pick<
  PortfolioItem,
  "alt" | "categoryLabel" | "localPath" | "sourceAssetId"
> & {
  caption: string;
  format: "landscape" | "portrait";
};

export type ProjectThemeChapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  images: readonly ProjectThemeImage[];
};

export type ProjectThemeStory = {
  projectId: ProjectId;
  title: string;
  introduction: string;
  chapters: readonly ProjectThemeChapter[];
};

const portfolioBySourceAssetId = new Map(
  portfolioItems.map((item) => [item.sourceAssetId, item]),
);

function archiveImage(
  sourceAssetId: string,
  caption: string,
  format: ProjectThemeImage["format"] = "landscape",
): ProjectThemeImage {
  const item = portfolioBySourceAssetId.get(sourceAssetId);

  if (!item) {
    throw new Error(`Unknown public Granit Decor portfolio asset: ${sourceAssetId}`);
  }

  return {
    sourceAssetId: item.sourceAssetId,
    localPath: item.localPath,
    alt: caption,
    categoryLabel: item.categoryLabel,
    caption,
    format,
  };
}

/**
 * Each route starts with one verified public archive image in `projects`. The
 * records below deliberately curate different completed works around that
 * image's visual category; they are not presented as additional photographs
 * of the same physical project.
 */
export const projectThemeStories = {
  "granit-decor-darbai-03": {
    projectId: "granit-decor-darbai-03",
    title: "Virtuvė bendroje erdvėje",
    introduction:
      "Atrinkti vaizdai rodo, kaip stalviršis ir sala veikia bendrame virtuvės, valgomojo ir poilsio zonų plane.",
    chapters: [
      {
        id: "bendras-planas",
        eyebrow: "Erdvės kompozicija",
        title: "Virtuvė bendrame plane",
        body: "Platesni kadrai leidžia vertinti paviršiaus mastelį, salos vietą ir judėjimą tarp skirtingų erdvės zonų.",
        images: [
          archiveImage("granit-decor-darbai_01", "Sala matoma bendrame virtuvės ir valgomojo plane."),
          archiveImage("granit-decor-darbai_08", "Stalviršis ir valgomojo zona vienoje atviroje erdvėje."),
          archiveImage("granit-decor-darbai_09", "Darbo zona ir sala per visą virtuvės plotį."),
          archiveImage("granit-decor-darbai_05", "Virtuvės paviršiai matomi iš poilsio zonos."),
        ],
      },
      {
        id: "darbo-zonos",
        eyebrow: "Funkcinė sandara",
        title: "Darbo zonos ritmas",
        body: "Skirtingos kompozicijos parodo stalviršio ryšį su spintomis, įranga ir kasdienėmis darbo vietomis.",
        images: [
          archiveImage("granit-decor-darbai_04", "Stalviršis sujungia dvi virtuvės darbo zonas."),
          archiveImage("granit-decor-darbai_07", "Sala ir sieninė darbo zona vienoje kompozicijoje."),
          archiveImage("granit-decor-darbai_02", "Akmens paviršius kartojamas saloje ir sieninėje zonoje."),
          archiveImage("granit-decor-darbai_06", "Sala skiria maisto ruošimo ir valgomojo zonas."),
        ],
      },
    ],
  },
  "granit-decor-darbai-05": {
    projectId: "granit-decor-darbai-05",
    title: "Virtuvės ir valgomojo ryšys",
    introduction:
      "Teminė atranka skirta erdvėms, kuriose virtuvės stalviršis turi derėti ne tik su baldais, bet ir su valgomojo kompozicija.",
    chapters: [
      {
        id: "bendras-vaizdas",
        eyebrow: "Erdvės ryšys",
        title: "Virtuvė šalia valgomojo",
        body: "Bendri vaizdai padeda matyti, kaip darbo paviršius, sala arba stalas įsirašo į visos patalpos proporcijas.",
        images: [
          archiveImage("virtuves-baldai-stalvirsiai-49", "Virtuvės darbo zona ir valgomojo stalas bendrame plane."),
          archiveImage("virtuves-baldai-stalvirsiai-52", "Valgomojo vieta išdėstyta greta virtuvės paviršių."),
          archiveImage("virtuves-baldai-stalvirsiai-28", "Ilgas stalviršis formuoja pagrindinę virtuvės darbo liniją."),
          archiveImage("virtuves-baldai-stalvirsiai-43", "Virtuvės paviršius matomas atviroje pereinamoje erdvėje."),
        ],
      },
      {
        id: "medziagu-ritmas",
        eyebrow: "Paviršių kompozicija",
        title: "Stalviršis kaip jungtis",
        body: "Artimesni vaizdai rodo, kaip paviršiaus tonas ir mastelis sieja virtuvės baldus su greta esančiais elementais.",
        images: [
          archiveImage("virtuves-baldai-stalvirsiai-50", "Stalviršis tęsiasi per visą sieninę darbo zoną."),
          archiveImage("virtuves-baldai-stalvirsiai-53", "Darbo paviršius tarp aukštų spintų ir valgomojo zonos.", "portrait"),
          archiveImage("virtuves-baldai-stalvirsiai-18", "Sala papildo sieninį virtuvės stalviršį."),
          archiveImage("virtuves-baldai-stalvirsiai-01", "Šviesus stalviršis išryškina salos kontūrą."),
        ],
      },
    ],
  },
  "granit-decor-darbai-13": {
    projectId: "granit-decor-darbai-13",
    title: "Paviršius iš arti",
    introduction:
      "Šioje atrankoje dėmesys skiriamas ne visai patalpai, o stalviršio masteliui, kraštams ir jo santykiui su baldų plokštumomis.",
    chapters: [
      {
        id: "rastas-ir-mastelis",
        eyebrow: "Paviršiaus vaizdas",
        title: "Raštas darbo zonoje",
        body: "Artimesniuose kadruose matyti, kiek akmens rašto patenka į stalviršį ir sienelę bei kaip jis atrodo prie baldų fasadų.",
        images: [
          archiveImage("granit-decor-darbai_12", "Tamsus stalviršis ir sienelė prie lango."),
          archiveImage("virtuves-baldai-stalvirsiai-45", "Ryškaus rašto stalviršis šviesioje darbo zonoje."),
          archiveImage("virtuves-baldai-stalvirsiai-48", "Gyslotas paviršius tęsiasi per stalviršį ir sienelę."),
          archiveImage("virtuves-baldai-stalvirsiai-51", "Sienelės raštas matomas tarp virtuvės spintų."),
        ],
      },
      {
        id: "baldai-ir-pavirsius",
        eyebrow: "Mazgų kontekstas",
        title: "Paviršius prie baldų",
        body: "Skirtingi rakursai parodo stalviršio storio, krašto ir baldų plokštumų santykį neįvardijant nepatvirtintų techninių sprendinių.",
        images: [
          archiveImage("granit-decor-darbai_17", "Stalviršio kraštas matomas salos ir spintelių sandūroje."),
          archiveImage("granit-decor-darbai_18", "Salos paviršius matomas iš valgomojo pusės.", "portrait"),
          archiveImage("granit-decor-darbai_19", "Darbo paviršius tarp aukštų ir žemų spintų."),
          archiveImage("granit-decor-darbai_20", "Stalviršio plotis ir kraštas salos kompozicijoje.", "portrait"),
        ],
      },
    ],
  },
  "granit-decor-darbai-16": {
    projectId: "granit-decor-darbai-16",
    title: "Sala tamsaus akmens kompozicijoje",
    introduction:
      "Atrinkti darbai rodo skirtingas salos proporcijas ir jos ryšį su sieniniu stalviršiu, praėjimais bei valgymo vietomis.",
    chapters: [
      {
        id: "sala-erdveje",
        eyebrow: "Erdvės centras",
        title: "Sala bendrame plane",
        body: "Bendri vaizdai leidžia lyginti salos vietą, aplink ją paliktą erdvę ir ryšį su likusia virtuve.",
        images: [
          archiveImage("granit-decor-darbai_10", "Sala išdėstyta tarp sieninės virtuvės ir valgomojo."),
          archiveImage("granit-decor-darbai_14", "Tamsi sala kontrastuoja su šviesia bendra erdve."),
          archiveImage("granit-decor-darbai_15", "Sala ir sieninis stalviršis matomi viename rakurse."),
          archiveImage("granit-decor-darbai_21", "Sala atviroje virtuvės ir poilsio erdvėje."),
        ],
      },
      {
        id: "salos-forma",
        eyebrow: "Tūris ir proporcija",
        title: "Salos paviršiaus mastelis",
        body: "Skirtingo dydžio salos parodo, kaip paviršiaus plotas keičia virtuvės kompoziciją ir naudojimo scenarijų.",
        images: [
          archiveImage("granit-decor-darbai_34", "Sala įkomponuota tarp virtuvės ir svetainės zonų."),
          archiveImage("virtuves-baldai-stalvirsiai-03", "Tamsus darbo paviršius šviesių baldų kompozicijoje."),
          archiveImage("virtuves-baldai-stalvirsiai-05", "Platus salos stalviršis su išsikišančia valgymo zona."),
          archiveImage("virtuves-baldai-stalvirsiai-09", "Sala su kaitlentės zona bendrame virtuvės plane."),
        ],
      },
    ],
  },
  "granit-decor-darbai-25": {
    projectId: "granit-decor-darbai-25",
    title: "Salos forma ir mastelis",
    introduction:
      "Kolekcija skirta saloms, kurių paviršiaus forma ir kraštas tampa svarbia matoma visos virtuvės dalimi.",
    chapters: [
      {
        id: "forma-ir-kryptis",
        eyebrow: "Formos sprendimas",
        title: "Sala iš skirtingų rakursų",
        body: "Vaizdai padeda lyginti tiesias ir lenktas paviršiaus linijas, salos orientaciją bei jos santykį su aplinkiniais baldais.",
        images: [
          archiveImage("granit-decor-darbai_24", "Lenkta sala ir vertikali akmens sienos plokštuma."),
          archiveImage("granit-decor-darbai_27", "Lenktas salos kontūras matomas iš sėdimosios pusės."),
          archiveImage("granit-decor-darbai_26", "Salos paviršius įkomponuotas priešais aukštas spintas."),
          archiveImage("virtuves-baldai-stalvirsiai-35", "Akmens paviršius apgaubia salos šoną."),
        ],
      },
      {
        id: "darbo-pavirsius",
        eyebrow: "Naudojimo zona",
        title: "Darbo ir valgymo paviršius",
        body: "Atranka parodo, kaip viename salos tūryje gali būti matoma maisto ruošimo, įrangos arba sėdėjimo zona.",
        images: [
          archiveImage("virtuves-baldai-stalvirsiai-47", "Sala su atvira sėdėjimo vieta ir akmens paviršiumi."),
          archiveImage("virtuves-baldai-stalvirsiai-28", "Pusiasalis formuoja atvirą virtuvės darbo zoną."),
          archiveImage("virtuves-baldai-stalvirsiai-34", "Sala ir sieninis stalviršis matomi bendrame plane."),
        ],
      },
    ],
  },
  "granit-decor-darbai-24": {
    projectId: "granit-decor-darbai-24",
    title: "Vertikalūs akmens paviršiai",
    introduction:
      "Teminė kolekcija rodo vertikalius akmens paviršius virtuvėse, vonios erdvėse, koridoriuose ir židinio zonoje.",
    chapters: [
      {
        id: "vertikalus-pavirsius",
        eyebrow: "Sienų apdaila",
        title: "Plokštė kaip erdvės akcentas",
        body: "Didelio formato vertikalus paviršius leidžia matyti rašto mastelį ir jo santykį su durimis, baldais bei santechnika.",
        images: [
          archiveImage("granit-decor-darbai_28", "Akmens plokštuma įkomponuota koridoriaus sienoje."),
          archiveImage("granit-decor-darbai_29", "Tamsus akmens raštas tęsiasi per vonios sieną."),
          archiveImage("granit-decor-darbai_31", "Šviesi akmens apdaila praustuvų ir vonios zonoje."),
          archiveImage("granit-decor-darbai_33", "Kontrastinga sienų apdaila vonios erdvėje."),
        ],
      },
      {
        id: "zidinio-zona",
        eyebrow: "Architektūrinė detalė",
        title: "Akmens apdaila aplink židinį",
        body: "Židinio pavyzdžiai parodo vertikalių ir horizontalių akmens elementų proporcijas skirtinguose interjeruose.",
        images: [
          archiveImage("granit-decor-darbai_14", "Akmens sienos plokštuma matoma bendrame svetainės plane."),
          archiveImage("granito-zidiniai-01", "Akmens apdaila aplink horizontalią židinio angą."),
          archiveImage("granito-zidiniai-02", "Židinio apdailos plokštumos ir grindų sandūra."),
          archiveImage("granito-zidiniai-04", "Vertikali akmens apdaila aplink židinio zoną.", "portrait"),
        ],
      },
    ],
  },
  "granit-decor-darbai-29": {
    projectId: "granit-decor-darbai-29",
    title: "Tamsaus paviršiaus mastelis",
    introduction:
      "Atrinkti darbai rodo tamsių akmens paviršių mastelį prie praustuvų, baldų ir kitų vonios elementų.",
    chapters: [
      {
        id: "erdves-vaizdas",
        eyebrow: "Vonios kompozicija",
        title: "Tamsus paviršius bendrame plane",
        body: "Bendresni kadrai leidžia vertinti, kiek tamsaus paviršiaus naudojama ir kaip jis dera su šviesiais vonios elementais.",
        images: [
          archiveImage("granit-decor-darbai_33", "Tamsi sienų apdaila ir šviesūs vonios elementai."),
          archiveImage("vonios-baldai-stalvirsiai-11", "Tamsi akmens apdaila aplink vonios tūrį."),
          archiveImage("vonios-baldai-stalvirsiai-13", "Tamsus paviršius po vienu praustuvu."),
        ],
      },
      {
        id: "praustuvo-zona",
        eyebrow: "Praustuvo detalė",
        title: "Stalviršis ir baldas",
        body: "Artimesni vaizdai rodo stalviršio plotį, kraštą ir jo santykį su praustuvu bei baldo fasadu.",
        images: [
          archiveImage("vonios-baldai-stalvirsiai-02", "Tamsus stalviršis su ant jo statomu praustuvu."),
          archiveImage("vonios-baldai-stalvirsiai-04", "Tamsaus akmens stalviršis virš pakabinamo baldo."),
          archiveImage("vonios-baldai-stalvirsiai-06", "Kontrastingas stalviršis po šviesiu praustuvu."),
          archiveImage("vonios-baldai-stalvirsiai-12", "Platus tamsaus tono stalviršis su dviem praustuvais."),
        ],
      },
    ],
  },
  "granit-decor-darbai-30": {
    projectId: "granit-decor-darbai-30",
    title: "Šviesaus paviršiaus proporcijos",
    introduction:
      "Teminė atranka rodo šviesius paviršius skirtingo dydžio praustuvų ir vonios baldų kompozicijose.",
    chapters: [
      {
        id: "praustuvu-kompozicija",
        eyebrow: "Šviesi erdvė",
        title: "Praustuvas ir stalviršis",
        body: "Pavyzdžiai leidžia lyginti vieno ir dviejų praustuvų zonas bei skirtingą stalviršio gylį ir ilgį.",
        images: [
          archiveImage("granit-decor-darbai_31", "Šviesi dviejų praustuvų zona prie lango."),
          archiveImage("vonios-baldai-stalvirsiai-01", "Ilgas šviesus stalviršis su dviem praustuvais."),
          archiveImage("vonios-baldai-stalvirsiai-03", "Lenktas šviesus paviršius po vienu praustuvu."),
          archiveImage("vonios-baldai-stalvirsiai-05", "Šviesus stalviršis su įleistu praustuvu."),
        ],
      },
      {
        id: "kasdienio-naudojimo-zona",
        eyebrow: "Paviršiaus mastelis",
        title: "Skirtingo ilgio darbo zona",
        body: "Artimesni vaizdai parodo, kiek paviršiaus paliekama šalia praustuvo ir kaip stalviršis užbaigia baldo tūrį.",
        images: [
          archiveImage("vonios-baldai-stalvirsiai-07", "Ilgas šviesus paviršius su vienu praustuvu."),
          archiveImage("vonios-baldai-stalvirsiai-08", "Kompaktiškas stalviršis po ant jo statomu praustuvu."),
          archiveImage("vonios-baldai-stalvirsiai-10", "Dviejų praustuvų stalviršis veidrodžių zonoje."),
        ],
      },
    ],
  },
  "granit-decor-darbai-31": {
    projectId: "granit-decor-darbai-31",
    title: "Stalviršio ir praustuvo santykis",
    introduction:
      "Kolekcijoje lyginamas stalviršio kraštas, praustuvo padėtis ir matomas paviršiaus plotas skirtinguose Granit Decor darbuose.",
    chapters: [
      {
        id: "krastas-ir-praustuvas",
        eyebrow: "Artimas vaizdas",
        title: "Stalviršio kraštas ir praustuvas",
        body: "Detalūs kadrai leidžia matyti praustuvo vietą, laisvą paviršiaus plotą ir stalviršio ryšį su baldu.",
        images: [
          archiveImage("vonios-baldai-stalvirsiai-02", "Praustuvas pastatytas ant tamsaus akmens stalviršio."),
          archiveImage("vonios-baldai-stalvirsiai-04", "Stalviršio kraštas matomas virš pakabinamo baldo."),
          archiveImage("vonios-baldai-stalvirsiai-06", "Tamsus stalviršis išryškina balto praustuvo kontūrą."),
          archiveImage("vonios-baldai-stalvirsiai-12", "Dviejų praustuvų išdėstymas ilgame stalviršyje."),
        ],
      },
      {
        id: "detale-kontekste",
        eyebrow: "Erdvės kontekstas",
        title: "Detalė bendrame vonios plane",
        body: "Bendresni vaizdai parodo, kaip stalviršis ir sienų apdaila veikia greta kitų vonios elementų.",
        images: [
          archiveImage("granit-decor-darbai_29", "Tamsi akmens apdaila visame vonios sienos plote."),
          archiveImage("granit-decor-darbai_30", "Šviesus paviršius praustuvų ir vonios zonoje.", "portrait"),
          archiveImage("granit-decor-darbai_33", "Kontrastinga sienų apdaila vonios interjere."),
          archiveImage("vonios-baldai-stalvirsiai-13", "Vieno praustuvo stalviršis greta kitų vonios elementų."),
        ],
      },
    ],
  },
} as const satisfies Record<ProjectId, ProjectThemeStory>;

for (const project of projects) {
  const story = projectThemeStories[project.id];
  const storyImages = story.chapters.flatMap((chapter) => chapter.images);

  if (storyImages.length < 6 || storyImages.length > 10) {
    throw new Error(`Project theme ${project.id} must contain between 6 and 10 supporting images.`);
  }

  if (storyImages.some((image) => image.sourceAssetId === project.sourceAssetId)) {
    throw new Error(`Project theme ${project.id} repeats its primary archive image.`);
  }
}

export function getProjectThemeStory(projectId: ProjectId) {
  return projectThemeStories[projectId];
}
