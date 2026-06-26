/**
 * Paramètres réglementaires centralisés — Calqeo
 *
 * Point d'entrée historique : les valeurs sont maintenues dans src/data/regulations/.
 * Ce module réexporte pour rétrocompatibilité des imports @/lib/config.
 *
 * @see src/data/regulations/
 */

export { REGULATIONS_GLOBAL as CONFIG_REFERENCE } from "@/data/regulations/registry";

export * from "./urssaf";
export * from "./fiscalite";
export * from "./retraite";
export * from "./aides";
