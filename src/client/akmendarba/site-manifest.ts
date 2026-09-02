import {
  assertValidSiteManifest,
} from "@/template/validate-manifest";
import {
  clientText,
  pendingParity,
  sourceText,
  uiText,
  type Block,
  type EvidenceRef,
  type MediaAsset,
  type NonEmpty,
  type PageRecord,
  type SiteManifest,
  type SourceRecord,
} from "@/template/schema";

const capturedAt = "2026-08-31T11:51:16.086Z";
const reviewedAt = "2026-08-31";

const evidence = (sourceId: string, locator?: string): NonEmpty<EvidenceRef> => [
  { sourceId, ...(locator ? { locator } : {}) },
];

const asNonEmpty = <T>(items: readonly T[]): NonEmpty<T> => {
  const [first, ...rest] = items;

  if (first === undefined) {
    throw new Error("Expected a non-empty migration record list.");
  }

  return [first, ...rest];
};

const sources = [
  ...([
  { id: "source-home", url: "https://akmendarba.lt/", title: "Pradžia" },
  { id: "source-about", url: "https://akmendarba.lt/apie-mus/", title: "Apie mus" },
  { id: "source-monuments", url: "https://akmendarba.lt/paminklai/", title: "Paminklai, Paminklų gamyba" },
  { id: "source-grave-coverings", url: "https://akmendarba.lt/kapo-dengimai/", title: "Kapo dengimai" },
  { id: "source-accessories", url: "https://akmendarba.lt/aksesuarai/", title: "Aksesuarai" },
  { id: "source-finishing", url: "https://akmendarba.lt/apdaila/", title: "Apdaila" },
  { id: "source-gallery", url: "https://akmendarba.lt/galerija/", title: "Galerija" },
  { id: "source-gallery-monuments", url: "https://akmendarba.lt/galerija/paminklu-galerija/", title: "Paminklų galerija" },
  { id: "source-gallery-grave-coverings", url: "https://akmendarba.lt/galerija/kapo-dengimu-galerija/", title: "Kapo dengimų galerija" },
  { id: "source-gallery-accessories", url: "https://akmendarba.lt/galerija/aksesuaru-galerija/", title: "Aksesuarų galerija" },
  { id: "source-gallery-finishing", url: "https://akmendarba.lt/galerija/apdailos-galerija/", title: "Apdailos galerija" },
  { id: "source-contact", url: "https://akmendarba.lt/kontaktai/", title: "Kontaktai" },
  { id: "source-cookies-lt", url: "https://akmendarba.lt/slapukai/", title: "Slapukai" },
    { id: "source-cookie-policy", url: "https://akmendarba.lt/cookie-policy/", title: "Cookie Policy" },
  ] as const).map((source) => ({
    ...source,
    kind: "url" as const,
    canonicalUrl: source.url,
    retrievedAt: capturedAt,
    status: "captured" as const,
  })),
  {
    id: "source-client-enhancements-2026-09-02",
    kind: "client-input" as const,
    artifactId: "codex-thread-2026-09-02-contact-form-stone-tools",
    title: "Client request: contact form, saved stones and stone comparison",
    receivedAt: "2026-09-02T10:00:00+03:00",
  },
] satisfies readonly SourceRecord[];

const numberedFiles = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => `${prefix}-${index + 1}.jpg`);

const mediaGroups = [
  {
    sourceId: "source-gallery-monuments",
    originalRoot: "https://akmendarba.lt/wp-content/uploads/2018/04",
    files: [...numberedFiles("paminklas-paprastas", 16), ...numberedFiles("paminklas-keliu-daliu", 64)],
  },
  {
    sourceId: "source-gallery-grave-coverings",
    originalRoot: "https://akmendarba.lt/wp-content/uploads/2018/04",
    files: numberedFiles("kapo-dengimas", 27),
  },
  {
    sourceId: "source-gallery-accessories",
    originalRoot: "https://akmendarba.lt/wp-content/uploads/2018/04",
    files: numberedFiles("Aksesuarai-is-akmens", 19),
  },
  {
    sourceId: "source-gallery-finishing",
    originalRoot: "https://akmendarba.lt/wp-content/uploads/2018/04",
    files: numberedFiles("Marmuro-apdaila", 5),
  },
] as const;

const miscMedia: readonly {
  file: string;
  sourceId: string;
  originalUri?: string;
}[] = [
  { file: "Logo-gradient-512x5125.png", sourceId: "source-home", originalUri: "https://akmendarba.lt/wp-content/uploads/2019/10/Logo-gradient-512x5125.png" },
  { file: "Karjeras-s.jpg", sourceId: "source-home", originalUri: "https://akmendarba.lt/wp-content/uploads/2018/06/Karjeras-s.jpg" },
  { file: "10.jpg", sourceId: "source-home", originalUri: "https://akmendarba.lt/wp-content/uploads/2018/05/10.jpg" },
  { file: "cava_bianco_carrara_2.jpg", sourceId: "source-home", originalUri: "https://akmendarba.lt/wp-content/uploads/2018/05/cava_bianco_carrara_2.jpg" },
  { file: "Granite-1.jpg", sourceId: "source-home", originalUri: "https://akmendarba.lt/wp-content/uploads/2018/05/Granite-1.jpg" },
  { file: "logo.png", sourceId: "source-home" },
  { file: "slider-1.jpg", sourceId: "source-home" },
  { file: "slider-2.jpg", sourceId: "source-home" },
  { file: "slider-3.jpg", sourceId: "source-home" },
  { file: "pastatas-2.jpg", sourceId: "source-about" },
  { file: "paminklai.jpg", sourceId: "source-monuments" },
  { file: "kapu-dengimas-plokstemis.jpg", sourceId: "source-grave-coverings" },
  { file: "aksesuarai-kapams.jpg", sourceId: "source-accessories" },
  { file: "Apdaila-naudojant-akmeni.jpg", sourceId: "source-finishing" },
  { file: "428d45ea13088a69ddb53a51d25d68df.jpg", sourceId: "source-home" },
  { file: "493bc85a737c694f6431a703479495de.jpg", sourceId: "source-home" },
  { file: "5ffff34cdf7fe20f6a6c581a98e2c09f.jpg", sourceId: "source-home" },
  { file: "a55bda83ad690e75a78ea6df89863f36.jpg", sourceId: "source-home" },
  { file: "cf19c9deecc4cbde3739880758b5b868.jpg", sourceId: "source-home" },
];

const toMediaId = (file: string) =>
  `media-${file.toLocaleLowerCase("lt-LT").replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-")}`;

const localMediaPath = (file: string) => `/client/akmendarba/source/${file}`;

const media = [
  ...mediaGroups.flatMap((group) =>
    group.files.map((file) => ({
      id: toMediaId(file),
      kind: "image" as const,
      decorative: true,
      variants: [{ src: localMediaPath(file), mimeType: "image/jpeg" }] as const,
      provenance: {
        evidence: evidence(group.sourceId),
        originalUri: `${group.originalRoot}/${file}`,
        rights: "unknown" as const,
        transformations: ["Self-hosted without visual alteration"],
      },
      parity: pendingParity(),
    })),
  ),
  ...miscMedia.map((item) => ({
    id: toMediaId(item.file),
    kind: item.file.endsWith("logo.png") || item.file.endsWith(".png") ? "logo" as const : "image" as const,
    decorative: true,
    variants: [{
      src: localMediaPath(item.file),
      mimeType: item.file.endsWith(".png") ? "image/png" : "image/jpeg",
    }] as const,
    provenance: {
      evidence: evidence(item.sourceId),
      ...(item.originalUri ? { originalUri: item.originalUri } : {}),
      rights: "unknown" as const,
      transformations: ["Self-hosted without visual alteration"],
    },
    parity: pendingParity(),
  })),
] satisfies readonly MediaAsset[];

const richTextBlock = (id: string, sourceId: string, paragraphs: readonly string[], heading?: string): Block => ({
  id,
  type: "richText",
  publication: "published",
  data: {
    ...(heading ? { heading: sourceText(heading, evidence(sourceId)) } : {}),
    paragraphs: asNonEmpty(paragraphs.map((paragraph) => sourceText(paragraph, evidence(sourceId)))),
  },
  parity: pendingParity(),
});

const heroBlock = (id: string, sourceId: string, heading: string, body?: string, mediaId?: string): Block => ({
  id,
  type: "hero",
  publication: "published",
  data: {
    heading: sourceText(heading, evidence(sourceId)),
    ...(body ? { body: sourceText(body, evidence(sourceId)) } : {}),
    ...(mediaId ? { mediaId } : {}),
  },
  parity: pendingParity(),
});

const page = ({
  id,
  path,
  title,
  sourceId,
  kind,
  blocks,
  parentPageId,
  noIndex,
}: {
  id: string;
  path: `/${string}`;
  title: string;
  sourceId: string;
  kind: PageRecord["kind"];
  blocks: readonly Block[];
  parentPageId?: string;
  noIndex?: boolean;
}): PageRecord => ({
  id,
  path,
  kind,
  ...(parentPageId ? { parentPageId } : {}),
  title: sourceText(title, evidence(sourceId)),
  navigationTitle: sourceText(title, evidence(sourceId)),
  publication: "published",
  blocks,
  seo: {
    title: sourceText(title, evidence(sourceId)),
    ...(noIndex ? { noIndex: true } : {}),
  },
  parity: pendingParity(),
});

const monumentMediaIds = asNonEmpty([
  ...[1, 2, 3, 4, 5, 6, 7, 8, 16, 9, 10, 11, 12, 13, 14, 15].map((number) => `paminklas-paprastas-${number}.jpg`),
  ...numberedFiles("paminklas-keliu-daliu", 64),
].map(toMediaId));
const graveCoveringMediaIds = asNonEmpty(
  numberedFiles("kapo-dengimas", 27)
    .filter((_, index) => ![4, 17].includes(index))
    .map(toMediaId),
);
const accessoryMediaIds = asNonEmpty(numberedFiles("Aksesuarai-is-akmens", 19).map(toMediaId));
const finishingMediaIds = asNonEmpty(numberedFiles("Marmuro-apdaila", 5).map(toMediaId));

const pages: readonly PageRecord[] = [
  page({
    id: "page-home",
    path: "/",
    title: "Pradžia",
    sourceId: "source-home",
    kind: "home",
    blocks: [
      heroBlock("home-hero", "source-home", "Granito blokai ir plokštės", "Aukščiausios kokybės iš SKANDINAVIJOS!", toMediaId("Granite-1.jpg")),
      richTextBlock("home-introduction", "source-home", [
        "Akmuo yra viena seniausių pasaulio statybinių medžiagų, žinomų žmogui, bet vis dar tokia pat populiari kaip ir prieš tūkstančius metų.",
        "Naujausios technologijos suteikia galimybę mums rasti vis daugiau ir daugiau akmens rūšių, kurios apdirbtos savo grožiu ir patvarumu pralenkia daugelį šiuolaikinių statyboje bei interjero kūrime naudojamų medžiagų.",
      ]),
      {
        id: "home-services",
        type: "collection",
        publication: "published",
        data: {
          heading: sourceText("Mūsų teikiamos paslaugos", evidence("source-home")),
          itemPageIds: ["page-monuments", "page-grave-coverings", "page-accessories", "page-finishing"],
          presentation: "grid",
        },
        parity: pendingParity(),
      },
      richTextBlock("home-working-method", "source-home", [
        "Atvykstame prie kapavietės, konsultuojame, projektuojame, gaminame ir montuojame.",
        "Galime pagaminti paminklą pagal jūsų pateiktą brėžinį ar nuotrauką.",
        "Mes neperpardavinėjame paminklų, o juos gaminame patys. Mūsų gamybos procesas pradedamas nuo granito bloko, o tai mums leidžia atrinkti kokybiškas medžiagas ir pasiūlyti lanksčius gaminių dydžius bei kainas.",
      ]),
    ],
  }),
  page({
    id: "page-about",
    path: "/apie-mus",
    title: "Apie mus",
    sourceId: "source-about",
    kind: "custom",
    blocks: [
      heroBlock("about-hero", "source-about", "Apie mus", undefined, toMediaId("pastatas-2.jpg")),
      richTextBlock("about-copy", "source-about", [
        "Akmuo yra viena seniausių pasaulio statybinių medžiagų, žinomų žmogui, bet vis dar tokia pat populiari kaip ir prieš tūkstančius metų. Naujausios technologijos suteikia galimybę mums rasti vis daugiau ir daugiau akmens rūšių, kurios apdirbtos savo grožiu ir patvarumu pralenkia daugelį šiuolaikinių statyboje bei interjero kūrime naudojamų medžiagų.",
        "Mūsų įmonė įsikūrusi Einoraičių kaime 3 km nuo Šiaulių. Mūsų patalpose sumontuota virš 20 akmens apdirbimo staklių, suteikiančių galimybę greitai ir itin kokybiškai apdirbti granito bei marmuro gaminius.",
        "Turime daugiametę patirtį dirbant su granito blokais ir plokštėmis!",
      ]),
    ],
  }),
  page({
    id: "page-monuments",
    path: "/paminklai",
    title: "Paminklai, Paminklų gamyba",
    sourceId: "source-monuments",
    kind: "detail",
    blocks: [
      heroBlock("monuments-hero", "source-monuments", "Paminklai | Paminklų gaminimas", undefined, toMediaId("paminklai.jpg")),
      richTextBlock("monuments-copy", "source-monuments", [
        "Gaminame paminklus iš aukščiausios kokybės granito blokų, kurie pas mus atkeliauja iš Skandinavijos. Ilgametė patirtis dirbant šioje srityje praturtino mūsų žinių bagažą, suteikiant galimybę sukurti išskirtinius ir kokybiškus paminklus bei kitus kapo puošimo atributus.",
        "Gamybinio proceso metu glaudžiai bendradarbiaujame su užsakovu – Jumis. Visuomet surandame tinkamiausią ir vizualiai gražiausiai derintį sprendimą už patrauklią kainą.",
        "Paminklų gaminimas Šiauliuose bei visoje Lietuvoje. Gaminame naudojant kokybišką granitą, atkeliavusį iš Skandinavijos.",
      ]),
    ],
  }),
  page({
    id: "page-grave-coverings",
    path: "/kapo-dengimai",
    title: "Kapo dengimai",
    sourceId: "source-grave-coverings",
    kind: "detail",
    blocks: [
      heroBlock("grave-coverings-hero", "source-grave-coverings", "Kapo dengimai", undefined, toMediaId("kapu-dengimas-plokstemis.jpg")),
      richTextBlock("grave-coverings-copy", "source-grave-coverings", [
        "Suteiksime išskirtinę išvaizdą Jūsų artimojo amžinojo poilsio vietai uždengdami ją granito plokšte. Gaminame įvairaus dydžio bei spalvų kapo uždengimus iš granito plokščių. Daugiametė patirtis dirbant su granito plokštėmis užtikrins kokybišką produktą, o mūsų skulptoriai pasirūpins derančiu kapo vietos vaizdu.",
        "Kapo dengimas Šiauliuose bei visoje Lietuvoje. Kapo dengimams naudojame aukščiausios kokybės skandinavišką granitą.",
      ]),
    ],
  }),
  page({
    id: "page-accessories",
    path: "/aksesuarai",
    title: "Aksesuarai",
    sourceId: "source-accessories",
    kind: "detail",
    blocks: [
      heroBlock("accessories-hero", "source-accessories", "Aksesuarai | Kapo aksesuarai", undefined, toMediaId("aksesuarai-kapams.jpg")),
      richTextBlock("accessories-copy", "source-accessories", [
        "Norint, kad kapas išsiskirtų iš daugumos bei turėtų unikalų ir sau būdingą vaizdą, aksesuarai yra neatsiejama jo dalis. Gaminame įvairią kapo atributiką, užrašome Jūsų norimą tekstą ar nupiešiame pasirinktą vaizdą.",
        "Kapų aksesuarai bei jų gamyba Šiauliuose ir visoje Lietuvoje.",
      ]),
    ],
  }),
  page({
    id: "page-finishing",
    path: "/apdaila",
    title: "Apdaila",
    sourceId: "source-finishing",
    kind: "detail",
    blocks: [
      heroBlock("finishing-hero", "source-finishing", "Granito plokštės vidaus ir išorės apdailai", undefined, toMediaId("Apdaila-naudojant-akmeni.jpg")),
      richTextBlock("finishing-copy", "source-finishing", [
        "Granito plokščių panaudojimas vidaus ir išorės apdailai. Išskirtinės išvaizdos ir prabangos pojūtį suteikiančios plokštės gali papuošti namus ar darbo vietą.",
        "Granito plokštės Šiauliuose ir visoje Lietuvoje. Granito plokščių pjovimas bei apdirbimas.",
      ]),
    ],
  }),
  page({
    id: "page-gallery",
    path: "/galerija",
    title: "Galerija",
    sourceId: "source-gallery",
    kind: "index",
    blocks: [
      heroBlock("gallery-hero", "source-gallery", "Galerija"),
      {
        id: "gallery-categories",
        type: "collection",
        publication: "published",
        data: {
          heading: sourceText("Galerija", evidence("source-gallery")),
          itemPageIds: ["page-gallery-monuments", "page-gallery-grave-coverings", "page-gallery-accessories", "page-gallery-finishing"],
          presentation: "grid",
        },
        parity: pendingParity(),
      },
    ],
  }),
  page({
    id: "page-gallery-monuments",
    path: "/galerija/paminklu-galerija",
    title: "Paminklų galerija",
    sourceId: "source-gallery-monuments",
    kind: "index",
    parentPageId: "page-gallery",
    blocks: [
      heroBlock("gallery-monuments-hero", "source-gallery-monuments", "Paminklų galerija"),
      {
        id: "gallery-monuments-images",
        type: "gallery",
        publication: "published",
        data: { mediaIds: monumentMediaIds },
        parity: pendingParity(),
      },
    ],
  }),
  page({
    id: "page-gallery-grave-coverings",
    path: "/galerija/kapo-dengimu-galerija",
    title: "Kapo dengimų galerija",
    sourceId: "source-gallery-grave-coverings",
    kind: "index",
    parentPageId: "page-gallery",
    blocks: [
      heroBlock("gallery-grave-coverings-hero", "source-gallery-grave-coverings", "Kapų dengimo galerija"),
      {
        id: "gallery-grave-coverings-images",
        type: "gallery",
        publication: "published",
        data: { mediaIds: graveCoveringMediaIds },
        parity: pendingParity(),
      },
    ],
  }),
  page({
    id: "page-gallery-accessories",
    path: "/galerija/aksesuaru-galerija",
    title: "Aksesuarų galerija",
    sourceId: "source-gallery-accessories",
    kind: "index",
    parentPageId: "page-gallery",
    blocks: [
      heroBlock("gallery-accessories-hero", "source-gallery-accessories", "Aksesuarų galerija"),
      {
        id: "gallery-accessories-images",
        type: "gallery",
        publication: "published",
        data: { mediaIds: accessoryMediaIds },
        parity: pendingParity(),
      },
    ],
  }),
  page({
    id: "page-gallery-finishing",
    path: "/galerija/apdailos-galerija",
    title: "Apdailos galerija",
    sourceId: "source-gallery-finishing",
    kind: "index",
    parentPageId: "page-gallery",
    blocks: [
      heroBlock("gallery-finishing-hero", "source-gallery-finishing", "Apdailos galerija"),
      {
        id: "gallery-finishing-images",
        type: "gallery",
        publication: "published",
        data: { mediaIds: finishingMediaIds },
        parity: pendingParity(),
      },
    ],
  }),
  {
    id: "page-materials",
    path: "/akmuo",
    kind: "index",
    title: clientText("Akmens pasirinkimas", evidence("source-client-enhancements-2026-09-02")),
    navigationTitle: clientText("Akmuo", evidence("source-client-enhancements-2026-09-02")),
    publication: "published",
    blocks: [
      {
        id: "materials-hero",
        type: "hero",
        publication: "published",
        data: {
          heading: clientText("Akmens pasirinkimas", evidence("source-client-enhancements-2026-09-02")),
          body: sourceText(
            "Akmendarba apdirba granito bei marmuro gaminius.",
            evidence("source-about", "Apie mus"),
          ),
          mediaId: toMediaId("Granite-1.jpg"),
        },
        parity: pendingParity(),
      },
      {
        id: "materials-selector",
        type: "function",
        publication: "published",
        data: { functionId: "function-material-selector" },
        parity: pendingParity(),
      },
    ],
    seo: {
      title: clientText("Akmens pasirinkimas | Akmendarba", evidence("source-client-enhancements-2026-09-02")),
      description: sourceText(
        "Granito ir marmuro pasirinkimas Akmendarba gaminiams.",
        evidence("source-about", "Apie mus"),
      ),
    },
    parity: pendingParity(),
  },
  page({
    id: "page-contact",
    path: "/kontaktai",
    title: "Kontaktai",
    sourceId: "source-contact",
    kind: "contact",
    blocks: [
      heroBlock("contact-hero", "source-contact", "Raskite mus"),
      {
        id: "contact-public-details",
        type: "facts",
        publication: "published",
        data: {
          heading: sourceText("Informacija ir užsakymų priėmimas", evidence("source-contact")),
          items: asNonEmpty([
            ["Būstinė", "Saulėtekio g. 47, Einoraičių kaimas, Šiaulių rajonas LT-80141"],
            ["Paminklų pardavimo aikštelė", "Tilžės g. 234, Šiauliai"],
            ["Telefonas", "+370 677 16667"],
            ["El. paštas", "info@akmendarba.lt"],
            ["Sigitas Karlinskas · Direktorius", "+370 698 77919"],
            ["Laura Bendikaitė · Gamybos vadovas", "+370 677 16667"],
            ["Įmonė", "Akmendarba, UAB"],
            ["Įmonės kodas", "300526494"],
            ["PVM mokėtojo kodas", "100002337416"],
            ["A/s", "LT 597300010093304943"],
            ["Bankas", "Swedbank"],
            ["Banko kodas", "7300"],
            ["S.W.I.F.T.", "HABALT 22"],
          ].map(([label, value]) => ({
            label: sourceText(label, evidence("source-contact")),
            value: sourceText(value, evidence("source-contact")),
          }))),
        },
        parity: pendingParity(),
      },
      {
        id: "contact-actions",
        type: "callToAction",
        publication: "published",
        data: {
          heading: sourceText("Informacija ir užsakymų priėmimas", evidence("source-contact")),
          actions: [
            { id: "contact-call", label: uiText("Skambinti"), target: { kind: "external", url: "tel:+37067716667", evidence: evidence("source-contact") } },
            { id: "contact-email", label: uiText("Rašyti el. paštu"), target: { kind: "external", url: "mailto:info@akmendarba.lt", evidence: evidence("source-contact") } },
            { id: "contact-facebook", label: sourceText("Facebook", evidence("source-contact")), target: { kind: "external", url: "https://www.facebook.com/akmendarba.granitas/", evidence: evidence("source-contact") } },
            { id: "contact-instagram", label: sourceText("Instagram", evidence("source-contact")), target: { kind: "external", url: "https://www.instagram.com/akmendarba/", evidence: evidence("source-contact") } },
          ],
        },
        parity: pendingParity(),
      },
      {
        id: "contact-enquiry-form",
        type: "function",
        publication: "published",
        data: { functionId: "function-contact-enquiry" },
        parity: pendingParity(),
      },
    ],
  }),
  page({
    id: "page-cookies-lt",
    path: "/slapukai",
    title: "Slapukai",
    sourceId: "source-cookies-lt",
    kind: "legal",
    blocks: [
      heroBlock("cookies-lt-hero", "source-cookies-lt", "Slapukai"),
      richTextBlock("cookies-lt-copy", "source-cookies-lt", [
        "Čia galite sužinoti, kokią informaciją apie Jus renkame, kai lankotės www.akmendarba.lt interneto svetainėje, ką su šia informacija darome ir kam perduodame.",
        "Jūsų asmens duomenų valdytojas yra Akmendarba, UAB, kodas 300526494, Saulėtekio g. 47, Einoraičių k., LT-80141 Šiaulių r.",
        "Statistinius svetainės naudojimo duomenis svetainė renka naudodama Google Analytics įrankius. Ši informacija apima lankytojų miestus, apsilankymų dažnį, naršykles ir naudojamus įrenginius.",
        "Svetainė naudoja slapukus tam, kad atpažintų pakartotinį lankytoją ir nustatytų, ar lankytojas sutiko su slapukų įrašymu. Ad-form ir Google slapukai nurodyti kaip naudojami rinkodaros bei statistikos tikslais.",
        "Slapukus galima kontroliuoti arba ištrinti naršyklės nustatymuose. Išjungus slapukus kai kurios paslaugos ir funkcijos gali neveikti.",
        "Naršymo statistiką gali peržiūrėti už svetainės tobulinimą ir priežiūrą atsakingi darbuotojai bei Google, Inc. Šaltinis nurodo, kad duomenys neparduodami.",
        "Google Analytics įrankiais surinkta statistinė informacija paprastai naudojama iki 2 metų.",
        "Dėl surinktų ar netikslių duomenų galima kreiptis el. paštu info@akmendarba.lt.",
      ]),
    ],
  }),
  page({
    id: "page-cookie-policy",
    path: "/cookie-policy",
    title: "Cookie Policy",
    sourceId: "source-cookie-policy",
    kind: "legal",
    blocks: [
      heroBlock("cookie-policy-hero", "source-cookie-policy", "Cookie Policy"),
      richTextBlock("cookie-policy-copy", "source-cookie-policy", [
        "This site uses cookies — small text files that are placed on your machine to help the site provide a better user experience. Cookies are used to retain user preferences, store information and provide anonymised tracking data to third-party applications such as Google Analytics. Visitors can disable cookies in their browser settings.",
      ]),
    ],
  }),
];

const functions = [
  {
    id: "function-contact-enquiry",
    type: "form" as const,
    implementationKey: "akmendarba.contact-enquiry-preview",
    config: {
      experience: "Contact enquiry preparation",
      fields: ["name", "phoneOrEmail", "service", "message", "consent"],
      delivery: "No network request; the browser prepares a reviewable summary only.",
    },
    evidence: evidence("source-client-enhancements-2026-09-02"),
    publication: "published" as const,
    testFixtureIds: ["fixture-contact-enquiry-local-preview"] as const,
    parity: pendingParity(),
    integrationStatus: "frontend-only" as const,
    capability: {
      experienceId: "experience-contact-enquiry",
      capabilityId: "capability-contact-enquiry-input",
      kind: "input" as const,
      execution: "local" as const,
      label: clientText("Kontaktinė užklausa", evidence("source-client-enhancements-2026-09-02")),
      evidence: evidence("source-client-enhancements-2026-09-02"),
    },
    integrationBlocker: {
      sourceId: "source-client-enhancements-2026-09-02",
      functionId: "function-contact-enquiry",
      publication: "published" as const,
      rationale: "The client requested the form UI, but no email, CRM endpoint or delivery credentials have been supplied. The published demo therefore performs no remote submission and says so explicitly.",
    },
  },
  {
    id: "function-material-selector",
    type: "selector" as const,
    implementationKey: "akmendarba.material-selector",
    config: {
      experience: "Source-backed stone selection",
      sourceBackedCategories: ["Granitas", "Marmuras"],
      capabilities: ["saved-items", "comparison"],
      persistence: "Browser localStorage only",
      comparisonMaximum: 2,
    },
    evidence: evidence("source-client-enhancements-2026-09-02"),
    publication: "published" as const,
    testFixtureIds: ["fixture-material-save", "fixture-material-compare"] as const,
    parity: pendingParity(),
    integrationStatus: "complete" as const,
    capability: {
      experienceId: "experience-material-selector",
      capabilityId: "capability-material-selection",
      kind: "selection" as const,
      execution: "local" as const,
      label: clientText("Akmens išsaugojimas ir palyginimas", evidence("source-client-enhancements-2026-09-02")),
      evidence: evidence("source-client-enhancements-2026-09-02"),
    },
  },
  {
    id: "function-cookie-consent",
    type: "custom" as const,
    implementationKey: "akmendarba.cookie-consent",
    config: {
      sourceBehavior: "Consent banner links to /slapukai and stores the visitor's decision locally.",
      implementation: "Local notice preference only; analytics and third-party tracking are not active in the demo.",
    },
    evidence: evidence("source-home", "cookie banner"),
    publication: "published" as const,
    testFixtureIds: ["fixture-cookie-consent"] as const,
    parity: pendingParity(),
    integrationStatus: "complete" as const,
  },
] as const;

const pageBySourceId = new Map<string, string>([
  ["source-home", "page-home"],
  ["source-about", "page-about"],
  ["source-monuments", "page-monuments"],
  ["source-grave-coverings", "page-grave-coverings"],
  ["source-accessories", "page-accessories"],
  ["source-finishing", "page-finishing"],
  ["source-gallery", "page-gallery"],
  ["source-gallery-monuments", "page-gallery-monuments"],
  ["source-gallery-grave-coverings", "page-gallery-grave-coverings"],
  ["source-gallery-accessories", "page-gallery-accessories"],
  ["source-gallery-finishing", "page-gallery-finishing"],
  ["source-contact", "page-contact"],
  ["source-cookies-lt", "page-cookies-lt"],
  ["source-cookie-policy", "page-cookie-policy"],
  ["source-client-enhancements-2026-09-02", "page-materials"],
]);

export const akmendarbaSiteManifest = {
  schemaVersion: "1.0.0",
  siteId: "akmendarba",
  defaultLocale: "lt-LT",
  brand: {
    name: sourceText("Akmendarba", evidence("source-home")),
    legalName: sourceText("Akmendarba, UAB", evidence("source-contact")),
    logoMediaId: toMediaId("logo.png"),
    accent: "#65574b",
  },
  homePageId: "page-home",
  primaryPageId: "page-home",
  sources,
  sourceCoverage: sources.map((source) => ({
    sourceId: source.id,
    status: "migrated" as const,
    destinations: source.id === "source-client-enhancements-2026-09-02"
      ? [
          { kind: "page" as const, id: "page-materials" },
          { kind: "function" as const, id: "function-contact-enquiry" },
          { kind: "function" as const, id: "function-material-selector" },
        ]
      : [{ kind: "page" as const, id: pageBySourceId.get(source.id)! }],
    reviewedAt,
    note: source.id === "source-home"
      ? "The published notice persists its local acknowledgement; analytics and third-party tracking remain inactive."
      : undefined,
  })),
  media,
  functions,
  pages,
  navigation: {
    primary: [
      { id: "nav-about", label: sourceText("Apie mus", evidence("source-about")), target: { kind: "page", pageId: "page-about" } },
      {
        id: "nav-production",
        label: uiText("Produkcija"),
        target: { kind: "page", pageId: "page-monuments" },
        children: [
          { id: "nav-monuments", label: sourceText("Paminklai, Paminklų gamyba", evidence("source-monuments")), target: { kind: "page", pageId: "page-monuments" } },
          { id: "nav-grave-coverings", label: sourceText("Kapo dengimai", evidence("source-grave-coverings")), target: { kind: "page", pageId: "page-grave-coverings" } },
          { id: "nav-accessories", label: sourceText("Aksesuarai", evidence("source-accessories")), target: { kind: "page", pageId: "page-accessories" } },
          { id: "nav-finishing", label: sourceText("Apdaila", evidence("source-finishing")), target: { kind: "page", pageId: "page-finishing" } },
        ],
      },
      {
        id: "nav-materials",
        label: clientText("Akmuo", evidence("source-client-enhancements-2026-09-02")),
        target: { kind: "page", pageId: "page-materials" },
      },
      {
        id: "nav-gallery",
        label: sourceText("Galerija", evidence("source-gallery")),
        target: { kind: "page", pageId: "page-gallery" },
        children: [
          { id: "nav-gallery-monuments", label: sourceText("Paminklų galerija", evidence("source-gallery-monuments")), target: { kind: "page", pageId: "page-gallery-monuments" } },
          { id: "nav-gallery-grave-coverings", label: sourceText("Kapo dengimų galerija", evidence("source-gallery-grave-coverings")), target: { kind: "page", pageId: "page-gallery-grave-coverings" } },
          { id: "nav-gallery-accessories", label: sourceText("Aksesuarų galerija", evidence("source-gallery-accessories")), target: { kind: "page", pageId: "page-gallery-accessories" } },
          { id: "nav-gallery-finishing", label: sourceText("Apdailos galerija", evidence("source-gallery-finishing")), target: { kind: "page", pageId: "page-gallery-finishing" } },
        ],
      },
      { id: "nav-contact", label: sourceText("Kontaktai", evidence("source-contact")), target: { kind: "page", pageId: "page-contact" } },
    ],
    utility: [],
    footer: [
      { id: "footer-cookies-lt", label: sourceText("Slapukai", evidence("source-cookies-lt")), target: { kind: "page", pageId: "page-cookies-lt" } },
      { id: "footer-cookie-policy", label: sourceText("Cookie Policy", evidence("source-cookie-policy")), target: { kind: "page", pageId: "page-cookie-policy" } },
    ],
  },
} as const satisfies SiteManifest;

assertValidSiteManifest(akmendarbaSiteManifest);
