import type { ClientContactConfig } from "@/template/client-config";

export const akmendarbaContactConfig: ClientContactConfig = {
  phone: { display: "+370 677 16667", href: "tel:+37067716667" },
  email: { display: "info@akmendarba.lt", href: "mailto:info@akmendarba.lt" },
  address: {
    label: "Saulėtekio g. 47, Einoraičių k., Šiaulių r.",
    href: "https://www.google.com/maps/search/?api=1&query=Saul%C4%97tekio+g.+47%2C+Einorai%C4%8Diai%2C+%C5%A0iauli%C5%B3+r.",
    external: true,
  },
  location: {
    shortLabel: "Einoraičiai",
    dialogAriaLabel: "Akmendarba vieta",
    closeAriaLabel: "Uždaryti vietos informaciją",
    kicker: "Būstinė",
    title: "Einoraičiai",
    addressLines: [
      "Saulėtekio g. 47, Einoraičių kaimas",
      "Šiaulių rajonas LT-80141",
      "Paminklų pardavimo aikštelė: Tilžės g. 234, Šiauliai",
    ],
    mapActionLabel: "Atidaryti žemėlapį",
    closeLabel: "Uždaryti",
  },
};

export const akmendarbaPublicContacts = {
  general: {
    phone: "+370 677 16667",
    email: "info@akmendarba.lt",
    secondaryEmail: "jonas@akmendarba.lt",
  },
  people: [
    { name: "Sigitas Karlinskas", role: "Direktorius", phone: "+370 698 77919" },
    { name: "Laura Bendikaitė", role: "Gamybos vadovas", phone: "+370 677 16667" },
  ],
  locations: [
    { label: "Būstinė", address: "Saulėtekio g. 47, Einoraičių kaimas, Šiaulių rajonas LT-80141" },
    { label: "Paminklų pardavimo aikštelė", address: "Tilžės g. 234, Šiauliai" },
  ],
  company: {
    legalName: "Akmendarba, UAB",
    companyCode: "300526494",
    vatCode: "100002337416",
    bankAccount: "LT 597300010093304943",
    bank: "Swedbank",
    bankCode: "7300",
    swift: "HABALT 22",
  },
  social: [
    { label: "Facebook", href: "https://www.facebook.com/akmendarba.granitas/" },
    { label: "Instagram", href: "https://www.instagram.com/akmendarba/" },
  ],
} as const;
