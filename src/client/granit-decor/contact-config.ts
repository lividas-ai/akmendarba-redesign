import type { ClientContactConfig } from "@/template/client-config";

export const granitDecorContactConfig = {
  phone: { display: "+370 650 23784", href: "tel:+37065023784" },
  email: { display: "stone@granitdecor.lt", href: "mailto:stone@granitdecor.lt" },
  address: {
    label: "Kęstučio g. 1, Lentvaris",
    href: "https://www.google.com/maps/search/?api=1&query=K%C4%99stu%C4%8Dio+g.+1%2C+Lentvaris",
    external: true,
  },
  openingHours: "I–V 8:00–16:00",
  location: {
    shortLabel: "Lentvaris",
    dialogAriaLabel: "Granit Decor vieta",
    closeAriaLabel: "Uždaryti vietos informaciją",
    kicker: "Dirbtuvės ir konsultacijos",
    title: "Lentvaris",
    addressLines: ["Kęstučio g. 1, Lentvaris", "I–V 8:00–16:00"],
    note: "Prieš atvykdami susisiekite — pasiruošime aptarti jūsų projektą ir medžiagos pasirinkimą.",
    mapActionLabel: "Atidaryti žemėlapį",
    closeLabel: "Uždaryti",
  },
} as const satisfies ClientContactConfig;
