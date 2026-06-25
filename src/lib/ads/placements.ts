export type AdPlacementId =
  | "simulator-below-form"
  | "simulator-after-results"
  | "simulator-in-content"
  | "simulator-before-faq"
  | "simulator-sidebar";

export interface AdPlacementConfig {
  id: AdPlacementId;
  /** Libellé interne pour repérer l'emplacement */
  label: string;
  /** Format AdSense couramment utilisé */
  format: string;
  /** Dimensions indicatives (responsive selon viewport) */
  dimensions: string;
  /** Identifiant futur du slot AdSense (data-ad-slot) */
  adsenseSlotId: string;
  /** Afficher uniquement à partir de ce breakpoint Tailwind */
  minBreakpoint?: "sm" | "md" | "lg";
}

export const AD_PLACEMENTS: Record<AdPlacementId, AdPlacementConfig> = {
  "simulator-below-form": {
    id: "simulator-below-form",
    label: "Sous le formulaire",
    format: "Display responsive (horizontal)",
    dimensions: "728 × 90 (desktop) · 320 × 50 (mobile)",
    adsenseSlotId: "SIMULATOR_BELOW_FORM",
    minBreakpoint: "sm",
  },
  "simulator-after-results": {
    id: "simulator-after-results",
    label: "Après les résultats",
    format: "Display responsive (horizontal)",
    dimensions: "728 × 90 (desktop) · 320 × 100 (mobile)",
    adsenseSlotId: "SIMULATOR_AFTER_RESULTS",
    minBreakpoint: "sm",
  },
  "simulator-in-content": {
    id: "simulator-in-content",
    label: "Contenu éditorial",
    format: "In-article responsive",
    dimensions: "336 × 280 (fluid) · s'adapte à la largeur",
    adsenseSlotId: "SIMULATOR_IN_CONTENT",
  },
  "simulator-before-faq": {
    id: "simulator-before-faq",
    label: "Avant la FAQ",
    format: "Display responsive (horizontal)",
    dimensions: "728 × 90 (desktop) · 320 × 100 (mobile)",
    adsenseSlotId: "SIMULATOR_BEFORE_FAQ",
  },
  "simulator-sidebar": {
    id: "simulator-sidebar",
    label: "Barre latérale desktop",
    format: "Medium Rectangle",
    dimensions: "300 × 250 (fixe)",
    adsenseSlotId: "SIMULATOR_SIDEBAR",
    minBreakpoint: "lg",
  },
};

/** Passez à true après validation AdSense et remplissage des slot IDs réels. */
export const ADSENSE_ENABLED = false;
