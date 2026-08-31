const sourceRoot = "/client/akmendarba/source";

export type AkmendarbaService = {
  slug: "paminklai" | "kapo-dengimai" | "aksesuarai" | "apdaila";
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  paragraphs: readonly string[];
  cardImage: string;
  heroImage: string;
  heroAlt: string;
  galleryHref: string;
  galleryLabel: string;
  examples: readonly string[];
};

export const akmendarbaServices: readonly AkmendarbaService[] = [
  {
    slug: "paminklai",
    title: "Paminklų gamyba",
    shortTitle: "Paminklai",
    eyebrow: "Gaminame Lietuvoje",
    summary: "Paminklai iš kokybiškų granito blokų, atkeliaujančių iš Skandinavijos.",
    paragraphs: [
      "Gaminame paminklus iš aukščiausios kokybės granito blokų, kurie pas mus atkeliauja iš Skandinavijos. Ilgametė patirtis dirbant šioje srityje suteikia galimybę sukurti išskirtinius ir kokybiškus paminklus bei kitus kapo puošimo atributus.",
      "Gamybinio proceso metu glaudžiai bendradarbiaujame su užsakovu. Visuomet ieškome tinkamiausio ir vizualiai geriausiai derančio sprendimo už patrauklią kainą. Paminklus gaminame Šiauliuose ir montuojame visoje Lietuvoje.",
    ],
    cardImage: `${sourceRoot}/paminklai.jpg`,
    heroImage: `${sourceRoot}/paminklas-keliu-daliu-28.jpg`,
    heroAlt: "Akmendarba pagamintas kelių dalių granito paminklas",
    galleryHref: "/galerija/paminklu-galerija",
    galleryLabel: "Paminklų galerija",
    examples: [
      `${sourceRoot}/paminklas-keliu-daliu-28.jpg`,
      `${sourceRoot}/paminklas-keliu-daliu-13.jpg`,
      `${sourceRoot}/paminklas-keliu-daliu-2.jpg`,
      `${sourceRoot}/paminklas-keliu-daliu-18.jpg`,
      `${sourceRoot}/paminklas-keliu-daliu-63.jpg`,
      `${sourceRoot}/paminklas-keliu-daliu-60.jpg`,
    ],
  },
  {
    slug: "kapo-dengimai",
    title: "Kapo dengimai",
    shortTitle: "Kapo dengimas",
    eyebrow: "Granito plokštės",
    summary: "Įvairių dydžių ir spalvų kapo dengimai iš granito plokščių.",
    paragraphs: [
      "Suteikiame išskirtinę išvaizdą artimojo amžinojo poilsio vietai, uždengdami ją granito plokšte. Gaminame įvairaus dydžio bei spalvų kapo uždengimus iš granito plokščių.",
      "Daugiametė patirtis dirbant su granito plokštėmis padeda užtikrinti kokybišką rezultatą, o mūsų skulptoriai pasirūpina vientisu, prie kapavietės derančiu vaizdu. Kapo dengimus gaminame Šiauliuose ir montuojame visoje Lietuvoje, naudodami kokybišką skandinavišką granitą.",
    ],
    cardImage: `${sourceRoot}/kapu-dengimas-plokstemis.jpg`,
    heroImage: `${sourceRoot}/kapo-dengimas-24.jpg`,
    heroAlt: "Granito plokštėmis uždengta kapavietė",
    galleryHref: "/galerija/kapo-dengimu-galerija",
    galleryLabel: "Kapo dengimų galerija",
    examples: [
      `${sourceRoot}/kapo-dengimas-24.jpg`,
      `${sourceRoot}/kapo-dengimas-20.jpg`,
      `${sourceRoot}/kapo-dengimas-7.jpg`,
      `${sourceRoot}/kapo-dengimas-8.jpg`,
      `${sourceRoot}/kapo-dengimas-11.jpg`,
      `${sourceRoot}/kapo-dengimas-17.jpg`,
    ],
  },
  {
    slug: "aksesuarai",
    title: "Aksesuarai",
    shortTitle: "Aksesuarai",
    eyebrow: "Kapo atributika",
    summary: "Akmens atributika, individualūs užrašai ir pasirinkti vaizdai.",
    paragraphs: [
      "Norint, kad kapas išsiskirtų ir turėtų savitą išvaizdą, aksesuarai tampa neatsiejama jo dalimi. Gaminame įvairią kapo atributiką, užrašome pasirinktą tekstą ar išpiešiame pasirinktą vaizdą.",
      "Kapų aksesuarus gaminame Šiauliuose ir visoje Lietuvoje.",
    ],
    cardImage: `${sourceRoot}/aksesuarai-kapams.jpg`,
    heroImage: `${sourceRoot}/Aksesuarai-is-akmens-16.jpg`,
    heroAlt: "Akmendarba pagamintas akmens aksesuaras",
    galleryHref: "/galerija/aksesuaru-galerija",
    galleryLabel: "Aksesuarų galerija",
    examples: [
      `${sourceRoot}/Aksesuarai-is-akmens-16.jpg`,
      `${sourceRoot}/Aksesuarai-is-akmens-12.jpg`,
      `${sourceRoot}/Aksesuarai-is-akmens-13.jpg`,
      `${sourceRoot}/Aksesuarai-is-akmens-4.jpg`,
      `${sourceRoot}/Aksesuarai-is-akmens-1.jpg`,
      `${sourceRoot}/Aksesuarai-is-akmens-8.jpg`,
    ],
  },
  {
    slug: "apdaila",
    title: "Vidaus ir išorės apdaila",
    shortTitle: "Apdaila",
    eyebrow: "Granito plokštės",
    summary: "Granito plokščių pjovimas, apdirbimas ir pritaikymas apdailai.",
    paragraphs: [
      "Granito plokštės suteikia išskirtinę išvaizdą ir prabangos pojūtį, todėl jas pritaikome vidaus ir išorės apdailai namuose bei darbo vietose.",
      "Granito plokštės – Šiauliuose ir visoje Lietuvoje. Atliekame granito plokščių pjovimą bei apdirbimą.",
    ],
    cardImage: `${sourceRoot}/Apdaila-naudojant-akmeni.jpg`,
    heroImage: `${sourceRoot}/Marmuro-apdaila-1.jpg`,
    heroAlt: "Akmens plokščių apdaila interjere",
    galleryHref: "/galerija/apdailos-galerija",
    galleryLabel: "Apdailos galerija",
    examples: [`${sourceRoot}/Marmuro-apdaila-1.jpg`],
  },
] as const;

function imageList(prefix: string, numbers: readonly number[], alt: string) {
  return numbers.map((number) => ({
    src: `${sourceRoot}/${prefix}-${number}.jpg`,
    alt,
  }));
}

function imageSequence(prefix: string, count: number, alt: string) {
  return imageList(prefix, Array.from({ length: count }, (_, index) => index + 1), alt);
}

export const monumentOnePiece = imageList(
  "paminklas-paprastas",
  [1, 2, 3, 4, 5, 6, 7, 8, 16, 9, 10, 11, 12, 13, 14, 15],
  "Akmendarba pagamintas vienos dalies granito paminklas",
);

export const monumentMultiPiece = imageSequence(
  "paminklas-keliu-daliu",
  64,
  "Akmendarba pagamintas kelių dalių granito paminklas",
);

export const monumentGallery = [...monumentOnePiece, ...monumentMultiPiece] as const;

export const graveCoveringGallery = imageSequence(
  "kapo-dengimas",
  27,
  "Akmendarba atliktas kapo dengimas granito plokštėmis",
);

export const graveCoveringDedicatedGallery = graveCoveringGallery.filter(
  (_, index) => ![4, 17].includes(index),
);

export const accessoryGallery = imageSequence(
  "Aksesuarai-is-akmens",
  19,
  "Akmendarba pagamintas akmens aksesuaras",
);

export const accessoryMasterGallery = accessoryGallery.filter((_, index) => index !== 5);

export const finishGallery = imageSequence(
  "Marmuro-apdaila",
  5,
  "Akmendarba atlikta akmens plokščių apdaila",
);

export const galleryDirectories = [
  {
    id: "monuments",
    title: "Paminklai",
    href: "/galerija/paminklu-galerija",
    image: `${sourceRoot}/paminklas-keliu-daliu-39.jpg`,
    alt: "Akmendarba pagamintas granito paminklas",
  },
  {
    id: "coverings",
    title: "Kapo dengimai",
    href: "/galerija/kapo-dengimu-galerija",
    image: `${sourceRoot}/kapo-dengimas-24.jpg`,
    alt: "Granito plokštėmis uždengta kapavietė",
  },
  {
    id: "accessories",
    title: "Aksesuarai",
    href: "/galerija/aksesuaru-galerija",
    image: `${sourceRoot}/Aksesuarai-is-akmens-16.jpg`,
    alt: "Akmens aksesuaras",
  },
  {
    id: "finish",
    title: "Apdaila",
    href: "/galerija/apdailos-galerija",
    image: `${sourceRoot}/Marmuro-apdaila-1.jpg`,
    alt: "Akmens plokščių apdaila",
  },
] as const;

export const homeGalleryPreview = [
  monumentMultiPiece[38],
  graveCoveringGallery[23],
  accessoryGallery[15],
  finishGallery[0],
] as const;

export const aboutParagraphs = [
  "Akmuo yra viena seniausių pasaulio statybinių medžiagų, tačiau iki šiol išlieka aktualus. Šiuolaikinės technologijos leidžia atskleisti vis daugiau akmens rūšių, kurių grožis ir patvarumas pritaikomas statyboje bei interjere.",
  "Mūsų įmonė įsikūrusi Einoraičių kaime, 3 km nuo Šiaulių. Gamybinėse patalpose sumontuota daugiau kaip 20 akmens apdirbimo staklių, leidžiančių greitai ir kokybiškai apdirbti granito bei marmuro gaminius.",
  "Turime daugiametę patirtį dirbant su granito blokais ir plokštėmis.",
] as const;

export const homeIntroduction =
  "Akmuo yra viena seniausių žmogui žinomų statybinių medžiagų, tačiau iki šiol išlieka aktualus. Šiuolaikinės technologijos leidžia atskleisti jo grožį, ilgaamžiškumą ir pritaikyti akmenį skirtingiems darbams.";

export const manufacturingParagraphs = [
  "Atvykstame prie kapavietės, konsultuojame, projektuojame, gaminame ir montuojame. Paminklą galime pagaminti pagal jūsų pateiktą brėžinį ar nuotrauką.",
  "Paminklų neperpardavinėjame — juos gaminame patys. Gamybos procesą pradedame nuo granito bloko, todėl galime atrinkti kokybišką medžiagą ir lanksčiai derinti gaminių dydžius bei kainą.",
  "Dirbame atsakingai ir daug dėmesio skiriame atliktų darbų kokybei. Daugelis klientų po atliktų darbų mus rekomenduoja pažįstamiems ar draugams.",
] as const;

export type LegalCookieSection = {
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  links?: readonly { label: string; href: string }[];
};

export const legalCookiePolicyLt: readonly LegalCookieSection[] = [
  {
    title: "Statistiniai duomenys apie naršymą svetainėje",
    paragraphs: [
      "Svetainė nuolat tobulinama, todėl jos valdytojui svarbu suprasti, kuri informacija lankytojams aktualiausia, iš kurių miestų svetainė lankoma, kaip dažnai lankytojai sugrįžta, kokią naršyklę ir įrenginį naudoja.",
      "Šaltinio svetainėje šiai informacijai rinkti nurodomi Google Analytics įrankiai. Jeigu nenorite, kad Google Analytics fiksuotų informaciją apie naršymą, galite naudoti Google Analytics atsisakymo naršyklės papildinį.",
      "Naujoje demonstracinėje svetainėje Google Analytics ir kiti statistikos įrankiai nėra aktyvuoti.",
    ],
    links: [
      {
        label: "Daugiau informacijos apie Google Analytics",
        href: "https://support.google.com/analytics/answer/6004245?hl=lt",
      },
    ],
  },
  {
    title: "Slapukai",
    paragraphs: [
      "Kad svetainė tinkamai veiktų, ji gali įrašyti į lankytojo įrenginį mažas duomenų rinkmenas, vadinamas slapukais.",
    ],
  },
  {
    title: "Kaip naudojami slapukai",
    paragraphs: [
      "Šaltinio svetainėje slapukai naudojami šioms funkcijoms:",
    ],
    bullets: [
      "Atpažinti, ar svetainėje naršo tas pats lankytojas, kuris jau buvo apsilankęs.",
      "Nustatyti, ar lankytojas sutiko, kad slapukai būtų įrašomi jo įrenginyje.",
      "Adform ir Google slapukai nurodomi kaip naudojami elgesiu pagrįstos rinkodaros tikslais, kad lankytojui būtų pateikiama pritaikyta reklama.",
      "Google slapukai nurodomi kaip naudojami statistinei informacijai apie naršymą svetainėje rinkti.",
    ],
    links: [],
  },
  {
    title: "Trečiųjų šalių slapukai demonstracinėje svetainėje",
    paragraphs: [
      "Ši demonstracinė svetainė Adform, Google Analytics ir kitų trečiųjų šalių rinkodaros ar statistikos slapukų neįdiegia.",
    ],
  },
  {
    title: "Kaip kontroliuoti slapukus",
    paragraphs: [
      "Slapukus galima kontroliuoti arba ištrinti naršyklės nustatymuose. Daugumą naršyklių galima nustatyti taip, kad slapukai nebūtų įrašomi įrenginyje. Tokiu atveju kai kurias parinktis gali reikėti keisti rankiniu būdu kiekvieno apsilankymo metu, o kai kurios paslaugos ir funkcijos gali neveikti.",
    ],
    links: [{ label: "Išsamesnė informacija apie slapukų valdymą", href: "https://www.aboutcookies.org/" }],
  },
  {
    title: "Kam ir kodėl perduodama informacija",
    paragraphs: [
      "Šaltinio politikoje nurodoma, kad duomenis gali peržiūrėti darbuotojai, atsakingi už svetainės tobulinimą, priežiūrą ir lojalumo programų vykdymą, o naršymo statistiką saugo partneris Google, Inc.",
      "Bendrovė nurodo, kad duomenis laiko saugiai, to reikalauja ir iš partnerių bei paslaugų teikėjų, o duomenų neparduoda.",
    ],
  },
  {
    title: "Kiek laiko saugoma informacija",
    paragraphs: [
      "Šaltinio politikoje nurodoma, kad Google Analytics įrankiais surinkta statistinė informacija paprastai naudojama iki dvejų metų. Galutinius saugojimo terminus nustato informaciją saugantys partneriai.",
    ],
  },
  {
    title: "Kaip susipažinti su savo duomenimis",
    paragraphs: [
      "Asmens duomenų valdytojas yra Akmendarba, UAB, įmonės kodas 300526494, Saulėtekio g. 47, Einoraičių k., LT-80141 Šiaulių r.",
      "Norėdami sužinoti, kokie duomenys apie jus surinkti, patikslinti netikslius ar pasikeitusius duomenis arba kreiptis dėl duomenų apsaugos, rašykite el. paštu info@akmendarba.lt.",
    ],
  },
] as const;
