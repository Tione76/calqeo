import type { SimulatorDefinition } from "../types";

/**
 * Activation des brouillons.
 *
 * Pour publier un simulateur brouillon :
 * 1. Importer la définition depuis le fichier domaine (ex. `./aides-sociales`).
 * 2. L'ajouter au tableau ACTIVATED_DRAFTS ci-dousous.
 *
 * Le simulateur apparaîtra alors automatiquement dans menus, recherche, sitemap et build.
 */
// import { simulateurRsa } from "./aides-sociales";

export const ACTIVATED_DRAFTS: SimulatorDefinition[] = [
  // simulateurRsa,
];

/** Slugs activés — dérivé de ACTIVATED_DRAFTS */
export const ACTIVATE_DRAFT_SLUGS: readonly string[] = ACTIVATED_DRAFTS.map(
  (s) => s.slug
);

export function isDraftActivated(slug: string): boolean {
  return ACTIVATE_DRAFT_SLUGS.includes(slug);
}
