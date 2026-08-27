export type MaterialCategory =
  | "marmuras"
  | "granitas"
  | "oniksas"
  | "travertinas"
  | "kvarcitas";

export interface Material {
  slug: string;
  name: string;
  category: MaterialCategory;
  sourceUrl: string;
  optimizedUrl: string;
  localPath: string;
  featured: boolean;
  needsConfirmation: boolean;
  notes?: string;
}

interface MaterialSeed {
  slug: string;
  name: string;
  category: MaterialCategory;
  file: string;
  featured?: boolean;
  needsConfirmation?: boolean;
  notes?: string;
}

const SOURCE_ROOT =
  "https://irp.cdn-website.com/b8e91eb1/dms3rep/multi";
const OPTIMIZED_ROOT = `${SOURCE_ROOT}/opt`;

const toOptimizedFile = (file: string) =>
  file.replace(/(\.[^.]+)$/, "-1920w$1");

const material = ({
  slug,
  name,
  category,
  file,
  featured = false,
  needsConfirmation = false,
  notes,
}: MaterialSeed): Material => ({
  slug,
  name,
  category,
  sourceUrl: `${SOURCE_ROOT}/${file}`,
  optimizedUrl: `${OPTIMIZED_ROOT}/${toOptimizedFile(file)}`,
  localPath: `/assets/materials/${slug}.webp`,
  featured,
  needsConfirmation,
  ...(notes ? { notes } : {}),
});

export const materials: readonly Material[] = [
  // Marmuras (46)
  material({
    slug: "verde-guatemala",
    name: "Verde Guatemala",
    category: "marmuras",
    file: "Verde_Guatemala.jpg",
  }),
  material({
    slug: "thassos-white",
    name: "Thassos White",
    category: "marmuras",
    file: "thassos_white.jpg",
  }),
  material({
    slug: "statuario",
    name: "Statuario",
    category: "marmuras",
    file: "Statuario.jpg",
  }),
  material({
    slug: "statuario-extra",
    name: "Statuario Extra",
    category: "marmuras",
    file: "Statuario_Extra.jpg",
    featured: true,
  }),
  material({
    slug: "spider-black",
    name: "Spider Black",
    category: "marmuras",
    file: "spider_black.jpeg",
  }),
  material({
    slug: "sivec",
    name: "Sivec",
    category: "marmuras",
    file: "sivec.jpg",
  }),
  material({
    slug: "silver-waterfall",
    name: "Silver Waterfall",
    category: "marmuras",
    file: "silver_waterfall.jpg",
  }),
  material({
    slug: "rosa-portogallo",
    name: "Rosa Portogallo",
    category: "marmuras",
    file: "rosa-portogallo.jpg",
  }),
  material({
    slug: "serres-white",
    name: "Serres White",
    category: "marmuras",
    file: "serres_white_marmur.jpg",
  }),
  material({
    slug: "rosso-verona",
    name: "Rosso Verona",
    category: "marmuras",
    file: "Rosso_Verona.jpg",
  }),
  material({
    slug: "rain-forest-yellow",
    name: "Rain Forest Yellow",
    category: "marmuras",
    file: "Rain_Forest_Yellow.jpg",
  }),
  material({
    slug: "rojo-alicante",
    name: "Rojo Alicante",
    category: "marmuras",
    file: "Rojo_Alicante.jpg",
  }),
  material({
    slug: "rain-forest-green",
    name: "Rain Forest Green",
    category: "marmuras",
    file: "Rain_Forest_Green.jpg",
    featured: true,
  }),
  material({
    slug: "rain-forest-brown",
    name: "Rain Forest Brown",
    category: "marmuras",
    file: "Rain_Forest_Brown.jpg",
  }),
  material({
    slug: "portoro-oro",
    name: "Portoro Oro",
    category: "marmuras",
    file: "Portoro_Oro.jpg",
    featured: true,
  }),
  material({
    slug: "calacatta-berrini",
    name: "Calacatta Berrini",
    category: "marmuras",
    file: "Calacatta-berrini.jpg",
    needsConfirmation: true,
    notes:
      "Viešame kataloge rodoma „Calacatta Berrini“; patvirtinti, ar tai tikslus prekybinis pavadinimas, ar rašybos klaida.",
  }),
  material({
    slug: "grigio-piemonte",
    name: "Grigio Piemonte",
    category: "marmuras",
    file: "grigio-piemonte.jpg",
  }),
  material({
    slug: "pietra-grey",
    name: "Pietra Grey",
    category: "marmuras",
    file: "pietra_grey.JPG",
  }),
  material({
    slug: "nero-tunezi",
    name: "Nero Tunezi",
    category: "marmuras",
    file: "NeroTunezi.jpg",
    needsConfirmation: true,
    notes:
      "Viešame kataloge rodoma „Nero Tunezi“; patvirtinti tikslų prekybinį pavadinimą ir rašybą.",
  }),
  material({
    slug: "nero-marquina",
    name: "Nero Marquina",
    category: "marmuras",
    file: "Nero_Marquina.jpg",
  }),
  material({
    slug: "grigio-verace",
    name: "Grigio Verace",
    category: "marmuras",
    file: "Grigio_Verace.jpg",
  }),
  material({
    slug: "emperador-light",
    name: "Emperador Light",
    category: "marmuras",
    file: "Emperador_Light.jpg",
  }),
  material({
    slug: "diamond-oniciata",
    name: "Diamond Oniciata",
    category: "marmuras",
    file: "diamond-oniciata.jpg",
  }),
  material({
    slug: "crema-veneziana",
    name: "Crema Veneziana",
    category: "marmuras",
    file: "crema-veneziana.jpg",
  }),
  material({
    slug: "emperador-dark",
    name: "Emperador Dark",
    category: "marmuras",
    file: "Emperador_Dark.jpg",
  }),
  material({
    slug: "diamond-venatino",
    name: "Diamond Venatino",
    category: "marmuras",
    file: "Diamond_Venatino.jpg",
  }),
  material({
    slug: "calacatta-paonazzo",
    name: "Calacatta Paonazzo",
    category: "marmuras",
    file: "Calacatta-Paonazzo.jpg",
    featured: true,
  }),
  material({
    slug: "crema-marfil",
    name: "Crema Marfil",
    category: "marmuras",
    file: "Crema_Marfil.jpg",
  }),
  material({
    slug: "breccia-sarda-nuvolato",
    name: "Breccia Sarda Nuvolato",
    category: "marmuras",
    file: "Breccia-Sarda-Nuvolato.jpg",
  }),
  material({
    slug: "calacatta",
    name: "Calacatta",
    category: "marmuras",
    file: "Calacatta.jpg",
  }),
  material({
    slug: "calacatta-extra",
    name: "Calacatta Extra",
    category: "marmuras",
    file: "Calacatta_Extra.jpg",
  }),
  material({
    slug: "caffee-latte",
    name: "Caffee Latte",
    category: "marmuras",
    file: "Caffee_Latte.jpg",
    needsConfirmation: true,
    notes:
      "Viešame kataloge rodoma „Caffee Latte“; patvirtinti prekybinio pavadinimo rašybą.",
  }),
  material({
    slug: "breccia-sarda-venato",
    name: "Breccia Sarda Venato",
    category: "marmuras",
    file: "Breccia-Sarda-Venato.jpg",
  }),
  material({
    slug: "gris-parga-marmuras-source-conflict",
    name: "Gris Parga",
    category: "marmuras",
    file: "breccia_sarda_diagonale_.jpg",
    needsConfirmation: true,
    notes:
      "Konfliktuojantis viešas įrašas: paslėpta antraštė nurodo „Breccia Sarda Siagonale“, matomas tekstas ir alt tekstas – „Gris Parga“, o failas – „breccia_sarda_diagonale_“. Patvirtinti pavadinimą, rašybą ir kategoriją.",
  }),
  material({
    slug: "gris-iberico-marmuras-source-conflict",
    name: "Gris Iberico",
    category: "marmuras",
    file: "breccia_sarda_chiaro_.jpg",
    needsConfirmation: true,
    notes:
      "Konfliktuojantis viešas įrašas: matomas tekstas ir alt tekstas nurodo „Gris Iberico“, tačiau failas – „breccia_sarda_chiaro_“. Patvirtinti pavadinimą ir kategoriją.",
  }),
  material({
    slug: "bianco-statuarietto",
    name: "Bianco Statuarietto",
    category: "marmuras",
    file: "Bianco-Statuarietto.jpg",
  }),
  material({
    slug: "botticino-semiclassico",
    name: "Botticino Semiclassico",
    category: "marmuras",
    file: "Botticino_Semiclassico.jpg",
  }),
  material({
    slug: "blue-shadow",
    name: "Blue Shadow",
    category: "marmuras",
    file: "blue_shadow.jpeg",
  }),
  material({
    slug: "bianco-carrara-gioia",
    name: "Bianco Carrara Gioia",
    category: "marmuras",
    file: "Bianco-Carrara-Gioia.jpg",
  }),
  material({
    slug: "biancone-bianco-perlino",
    name: "Biancone Bianco Perlino",
    category: "marmuras",
    file: "Biancone_Bianco_Perlino.jpg",
  }),
  material({
    slug: "alpin-white",
    name: "Alpin White",
    category: "marmuras",
    file: "Alpin-White.jpg",
  }),
  material({
    slug: "bianco-neve",
    name: "Bianco Neve",
    category: "marmuras",
    file: "Bianco_Neve.jpg",
  }),
  material({
    slug: "bianco-carrara-c",
    name: "Bianco Carrara C",
    category: "marmuras",
    file: "Bianco_Carrara_C.jpg",
  }),
  material({
    slug: "bianco-carrarino",
    name: "Bianco Carrarino",
    category: "marmuras",
    file: "bianco_carrarino.jpg",
  }),
  material({
    slug: "bianco-carrara-cd",
    name: "Bianco Carrara CD",
    category: "marmuras",
    file: "Bianco_Carrara_CD.jpg",
  }),
  material({
    slug: "bardiglio",
    name: "Bardiglio",
    category: "marmuras",
    file: "Bardiglio.jpg",
  }),

  // Granitas (58)
  material({
    slug: "via-lattea",
    name: "Via Lattea",
    category: "granitas",
    file: "via-lattea2.jpg",
    featured: true,
  }),
  material({
    slug: "viscount-white",
    name: "Viscount White",
    category: "granitas",
    file: "Viscount_White.jpg",
    featured: true,
  }),
  material({
    slug: "verde-ubatuba",
    name: "Verde Ubatuba",
    category: "granitas",
    file: "Verde_Ubatuba.jpg",
  }),
  material({
    slug: "surf-green-granite",
    name: "Surf Green Granite",
    category: "granitas",
    file: "surf_green_granite.jpg",
  }),
  material({
    slug: "tan-brown",
    name: "Tan Brown",
    category: "granitas",
    file: "Tan_Brown.jpg",
  }),
  material({
    slug: "steel-grey-silver-grey",
    name: "Steel Grey Silver Grey",
    category: "granitas",
    file: "Steel_Grey_Silver_Grey.jpg",
  }),
  material({
    slug: "star-gate",
    name: "Star Gate",
    category: "granitas",
    file: "Star_Gate.jpg",
  }),
  material({
    slug: "star-galaxy",
    name: "Star Galaxy",
    category: "granitas",
    file: "Star_Galaxy.jpg",
  }),
  material({
    slug: "silver-bianco",
    name: "Silver Bianco",
    category: "granitas",
    file: "silver_bianco.jpeg",
  }),
  material({
    slug: "silvestre-gold",
    name: "Silvestre Gold",
    category: "granitas",
    file: "silvestre_Gold.jpeg",
  }),
  material({
    slug: "sahara-gold",
    name: "Sahara Gold",
    category: "granitas",
    file: "sahara_gold.jpeg",
  }),
  material({
    slug: "rosa-porrino",
    name: "Rosa Porrino",
    category: "granitas",
    file: "Rosa_Porrino.jpg",
  }),
  material({
    slug: "perfect-white",
    name: "Perfect White",
    category: "granitas",
    file: "Perfect-White.jpg",
  }),
  material({
    slug: "river-white",
    name: "River White",
    category: "granitas",
    file: "River_White.jpg",
  }),
  material({
    slug: "prada-gold",
    name: "Prada Gold",
    category: "granitas",
    file: "Prada_Gold.jpg",
  }),
  material({
    slug: "nero-angola",
    name: "Nero Angola",
    category: "granitas",
    file: "nero_angola.jpeg",
  }),
  material({
    slug: "nero-zimbabwe",
    name: "Nero Zimbabwe",
    category: "granitas",
    file: "Nero_Zimbabwe.jpg",
  }),
  material({
    slug: "metalicus",
    name: "Metalicus",
    category: "granitas",
    file: "Metalicus.jpg",
  }),
  material({
    slug: "multicolor-india",
    name: "Multicolor India",
    category: "granitas",
    file: "Multicolor_India.jpg",
  }),
  material({
    slug: "multicolor-green-kuppam",
    name: "Multicolor Green Kuppam",
    category: "granitas",
    file: "Multicolor_Green_Kuppam.jpg",
  }),
  material({
    slug: "matrix",
    name: "Matrix",
    category: "granitas",
    file: "matrix_granit_lupek_kamien_naturalny.jpg",
  }),
  material({
    slug: "marron-kongo",
    name: "Marron Kongo",
    category: "granitas",
    file: "Marron_Kongo.jpg",
  }),
  material({
    slug: "madura-gold",
    name: "Madura Gold",
    category: "granitas",
    file: "Madura_Gold.jpg",
  }),
  material({
    slug: "labrador-blue",
    name: "Labrador Blue",
    category: "granitas",
    file: "Labrador_Blue.jpg",
    featured: true,
  }),
  material({
    slug: "jet-black",
    name: "Jet Black",
    category: "granitas",
    file: "Jet_Black.jpg",
  }),
  material({
    slug: "ivory-white",
    name: "Ivory White",
    category: "granitas",
    file: "Ivory_White_granit.jpg",
  }),
  material({
    slug: "ivory-fantasy",
    name: "Ivory Fantasy",
    category: "granitas",
    file: "Ivory_Fantasy.jpg",
  }),
  material({
    slug: "imperial-coffee",
    name: "Imperial Coffee",
    category: "granitas",
    file: "imperial-coffee2.jpg",
  }),
  material({
    slug: "ivory-brown",
    name: "Ivory Brown",
    category: "granitas",
    file: "Ivory_Brown.jpg",
  }),
  material({
    slug: "indian-black-medium",
    name: "Indian Black Medium",
    category: "granitas",
    file: "Indian_Black_Medium.jpg",
  }),
  material({
    slug: "green",
    name: "Green",
    category: "granitas",
    file: "green.jpg",
    needsConfirmation: true,
    notes:
      "Viešame kataloge pateiktas tik bendrinis pavadinimas „Green“; patvirtinti pilną prekybinį pavadinimą.",
  }),
  material({
    slug: "indian-black-dark",
    name: "Indian Black Dark",
    category: "granitas",
    file: "Indian_Black_Dark.jpg",
  }),
  material({
    slug: "imperial-gold",
    name: "Imperial Gold",
    category: "granitas",
    file: "Imperial_Gold.jpg",
  }),
  material({
    slug: "gris-parga",
    name: "Gris Parga",
    category: "granitas",
    file: "Gris_Parga.jpg",
  }),
  material({
    slug: "gris-iberico",
    name: "Gris Iberico",
    category: "granitas",
    file: "Gris_Iberico.jpg",
  }),
  material({
    slug: "giallo-santa-cecilia",
    name: "Giallo Santa Cecilia",
    category: "granitas",
    file: "Giallo_Santa_Cecilia.jpg",
  }),
  material({
    slug: "giallo-new-venezian",
    name: "Giallo New Venezian",
    category: "granitas",
    file: "Giallo_New_Veneziano.jpg",
    needsConfirmation: true,
    notes:
      "Viešame tekste rodoma „Giallo New Venezian“, o failo pavadinime – „Giallo_New_Veneziano“; patvirtinti galūnę.",
  }),
  material({
    slug: "fantasy-gold",
    name: "Fantasy Gold",
    category: "granitas",
    file: "Fantasy_Gold.jpeg",
  }),
  material({
    slug: "cosmic-gold",
    name: "Cosmic Gold",
    category: "granitas",
    file: "cosmic-gold.jpg",
  }),
  material({
    slug: "cosmic-black",
    name: "Cosmic Black",
    category: "granitas",
    file: "Cosmic-Black.jpg",
    featured: true,
  }),
  material({
    slug: "crema-julia",
    name: "Crema Julia",
    category: "granitas",
    file: "crema_julia.jpeg",
  }),
  material({
    slug: "fusion-black",
    name: "Fusion Black",
    category: "granitas",
    file: "Fusion_Black.jpg",
  }),
  material({
    slug: "copacabana-black",
    name: "Copacabana Black",
    category: "granitas",
    file: "Copacabana_Black.jpg",
  }),
  material({
    slug: "chapa-copacana",
    name: "Chapa Copacana",
    category: "granitas",
    file: "chapa_copacana.jpg",
    needsConfirmation: true,
    notes:
      "Viešame kataloge rodoma „Chapa Copacana“; patvirtinti, ar tai tikslus prekybinis pavadinimas ir rašyba.",
  }),
  material({
    slug: "colonial-white",
    name: "Colonial White",
    category: "granitas",
    file: "Colonial_White.jpg",
  }),
  material({
    slug: "colonial-gold",
    name: "Colonial Gold",
    category: "granitas",
    file: "Colonial_Gold.jpg",
  }),
  material({
    slug: "colonial-cream",
    name: "Colonial Cream",
    category: "granitas",
    file: "Colonial_Cream.jpg",
  }),
  material({
    slug: "coffee-brown",
    name: "Coffee Brown",
    category: "granitas",
    file: "Coffee_Brown.jpg",
  }),
  material({
    slug: "black-nayara",
    name: "Black Nayara",
    category: "granitas",
    file: "Black-Nayara.jpg",
  }),
  material({
    slug: "bordeaux",
    name: "Bordeaux",
    category: "granitas",
    file: "Bordeaux.jpg",
  }),
  material({
    slug: "blue-seledin",
    name: "Blue Seledin",
    category: "granitas",
    file: "blue_seledin.jpeg",
    needsConfirmation: true,
    notes:
      "Viešame kataloge rodoma „Blue Seledin“; patvirtinti tikslų prekybinį pavadinimą ir rašybą.",
  }),
  material({
    slug: "azul-bahia",
    name: "Azul Bahia",
    category: "granitas",
    file: "Azul-Bahia.jpg",
    featured: true,
  }),
  material({
    slug: "black-pepper",
    name: "Black Pepper",
    category: "granitas",
    file: "black_pepper.jpeg",
  }),
  material({
    slug: "andromeda-white",
    name: "Andromeda White",
    category: "granitas",
    file: "andromeda_white.jpg",
  }),
  material({
    slug: "antique",
    name: "Antique",
    category: "granitas",
    file: "antique.jpg",
  }),
  material({
    slug: "aviva-white",
    name: "Aviva White",
    category: "granitas",
    file: "Aviva_White.jpg",
  }),
  material({
    slug: "astoria-cream",
    name: "Astoria Cream",
    category: "granitas",
    file: "Astoria_Cream.jpg",
  }),
  material({
    slug: "astoria-gold",
    name: "Astoria Gold",
    category: "granitas",
    file: "Astoria_Gold.jpg",
  }),

  // Oniksas (15)
  material({
    slug: "white-cristal",
    name: "White Cristal",
    category: "oniksas",
    file: "White-Cristal.jpg",
    featured: true,
    needsConfirmation: true,
    notes:
      "Viešame kataloge rodoma „White Cristal“; patvirtinti, ar tai tikslus prekybinis pavadinimas, ar turėtų būti „Crystal“.",
  }),
  material({
    slug: "verde-pakistano",
    name: "Verde Pakistano",
    category: "oniksas",
    file: "Verde_Pakistano.jpg",
  }),
  material({
    slug: "verde-jade",
    name: "Verde Jade",
    category: "oniksas",
    file: "Verde_Jade.jpg",
    featured: true,
  }),
  material({
    slug: "tanzania-dark",
    name: "Tanzania Dark",
    category: "oniksas",
    file: "Tanzania_Dark.jpg",
  }),
  material({
    slug: "orange-onyx",
    name: "Orange Onyx",
    category: "oniksas",
    file: "Orange_Onyx.jpg",
    featured: true,
  }),
  material({
    slug: "miele",
    name: "Miele",
    category: "oniksas",
    file: "Miele.jpg",
  }),
  material({
    slug: "kilimangiaro",
    name: "Kilimangiaro",
    category: "oniksas",
    file: "Kilimangiaro.jpg",
  }),
  material({
    slug: "cristallo",
    name: "Cristallo",
    category: "oniksas",
    file: "Cristallo.jpg",
  }),
  material({
    slug: "crema-onyx",
    name: "Crema Onyx",
    category: "oniksas",
    file: "Crema_Onyx.jpg",
  }),
  material({
    slug: "cappucino",
    name: "Cappucino",
    category: "oniksas",
    file: "Cappucino.jpg",
    needsConfirmation: true,
    notes:
      "Viešame kataloge rodoma „Cappucino“; patvirtinti prekybinio pavadinimo rašybą (galimai „Cappuccino“).",
  }),
  material({
    slug: "bianco-extra-onyx",
    name: "Bianco Extra Onyx",
    category: "oniksas",
    file: "Bianco_Extra_Onyx.jpg",
  }),
  material({
    slug: "arco-irys",
    name: "Arco Irys",
    category: "oniksas",
    file: "Arco_Irys.jpg",
    needsConfirmation: true,
    notes:
      "Viešame kataloge rodoma „Arco Irys“; patvirtinti prekybinio pavadinimo rašybą (galimai „Arco Iris“).",
  }),
  material({
    slug: "bianco-onyx",
    name: "Bianco Onyx",
    category: "oniksas",
    file: "Bianco_Onyx.jpg",
  }),
  material({
    slug: "avion-blue",
    name: "Avion Blue",
    category: "oniksas",
    file: "Avion_Blue.jpg",
    featured: true,
  }),
  material({
    slug: "avorio",
    name: "Avorio",
    category: "oniksas",
    file: "Avorio.jpg",
  }),

  // Travertinas (3)
  material({
    slug: "romano-classico",
    name: "Romano Classico",
    category: "travertinas",
    file: "Romano_Classico.jpg",
    featured: true,
  }),
  material({
    slug: "navona",
    name: "Navona",
    category: "travertinas",
    file: "Navona.jpg",
    featured: true,
  }),
  material({
    slug: "classico",
    name: "Classico",
    category: "travertinas",
    file: "Classico.jpg",
  }),

  // Kvarcitas (11)
  material({
    slug: "sublime",
    name: "Sublime",
    category: "kvarcitas",
    file: "Sublime.jpg",
  }),
  material({
    slug: "perla-santana",
    name: "Perla Santana",
    category: "kvarcitas",
    file: "Perla-Santana.jpg",
  }),
  material({
    slug: "roma-imperiale",
    name: "Roma Imperiale",
    category: "kvarcitas",
    file: "roma_imperiale.jpeg",
    featured: true,
  }),
  material({
    slug: "patagonia",
    name: "Patagonia",
    category: "kvarcitas",
    file: "Patagonia-30.jpg",
    featured: true,
  }),
  material({
    slug: "briliant-black",
    name: "Briliant Black",
    category: "kvarcitas",
    file: "Briliant_Black.jpg",
    needsConfirmation: true,
    notes:
      "Viešame kataloge rodoma „Briliant Black“; patvirtinti prekybinio pavadinimo rašybą (galimai „Brilliant Black“).",
  }),
  material({
    slug: "fusion-dark",
    name: "Fusion Dark",
    category: "kvarcitas",
    file: "fusion_dark.jpg",
  }),
  material({
    slug: "negresco",
    name: "Negresco",
    category: "kvarcitas",
    file: "negresco.jpg",
  }),
  material({
    slug: "nuvole-blue",
    name: "Nuvole Blue",
    category: "kvarcitas",
    file: "Nuvole_Blue.jpeg",
    featured: true,
  }),
  material({
    slug: "fusion-azul",
    name: "Fusion Azul",
    category: "kvarcitas",
    file: "Fusion-azul.jpg",
    featured: true,
  }),
  material({
    slug: "alexandrite",
    name: "Alexandrite",
    category: "kvarcitas",
    file: "Alexandrite.jpg",
  }),
  material({
    slug: "buff-grey",
    name: "Buff Grey",
    category: "kvarcitas",
    file: "BUFF_GREY_granit_KWARCYT_NATURALNY.jpg",
  }),
];
