/**
 * Identifiant GA4 — remplaçable via la variable d'environnement
 * NEXT_PUBLIC_GA_MEASUREMENT_ID (ex. G-XXXXXXXXXX).
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-CDP9D359WY";

export const GA_ENABLED = Boolean(GA_MEASUREMENT_ID);
