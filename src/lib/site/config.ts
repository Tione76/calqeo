/** Configuration globale du site Calqeo. */
export const SITE = {
  name: "Calqeo",
  tagline: "Simuler, calculer, décider",
  description:
    "Simulateurs et calculateurs en ligne gratuits : immobilier, finance, emploi, entreprises, fiscalité, travaux, santé et quotidien.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.calqeo.fr",
  locale: "fr_FR",
  contactEmail: "denis.antoine@live.fr",
} as const;

/** Informations légales — alignées sur les mentions légales publiées. */
export const LEGAL = {
  publisherName: "Calqeo",
  publisherLegalForm: "Entrepreneur individuel",
  publisherAddress: "[Adresse postale à compléter]",
  publisherSiret: "[SIRET à compléter]",
  publisherDirector: "Antoine Denis",
  hostName: "Vercel Inc.",
  hostAddress: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  dpoEmail: "denis.antoine@live.fr",
  /** Identifiant Google AdSense (ca-pub-…) — à renseigner après approbation. */
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
} as const;

export const LEGAL_LINKS = {
  mentionsLegales: "/mentions-legales",
  confidentialite: "/politique-de-confidentialite",
  cookies: "/politique-de-cookies",
  cgu: "/conditions-generales",
} as const;
