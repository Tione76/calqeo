/** Configuration globale du site — à personnaliser avant mise en production. */
export const SITE = {
  name: "Simulateurs et Calculateurs",
  tagline: "Outils gratuits pour simuler, calculer et décider",
  description:
    "Simulateurs et calculateurs en ligne gratuits : immobilier, finance, emploi, entreprises, fiscalité, travaux, santé et quotidien.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://simulateurs-et-calculateurs.fr",
  locale: "fr_FR",
  contactEmail: "contact@simulateurs-et-calculateurs.fr",
} as const;

/** Informations légales — complétez avant publication. */
export const LEGAL = {
  publisherName: "Simulateurs et Calculateurs",
  publisherLegalForm: "Entrepreneur individuel",
  publisherAddress: "[Adresse postale à compléter]",
  publisherSiret: "[SIRET à compléter]",
  publisherDirector: "[Nom du responsable de publication]",
  hostName: "Vercel Inc.",
  hostAddress: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  dpoEmail: "contact@simulateurs-et-calculateurs.fr",
  /** Identifiant Google AdSense (ca-pub-…) — à renseigner après approbation. */
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
} as const;

export const LEGAL_LINKS = {
  mentionsLegales: "/mentions-legales",
  confidentialite: "/politique-de-confidentialite",
  cookies: "/politique-de-cookies",
  cgu: "/conditions-generales",
} as const;
