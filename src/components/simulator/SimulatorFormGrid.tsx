import type { ReactNode } from "react";
import { AdSlot } from "@/components/ads/AdSlot";

interface SimulatorFormGridProps {
  form: ReactNode;
  results: ReactNode;
}

/**
 * Grille formulaire / résultats avec emplacements publicitaires intégrés.
 * Les bannières horizontales sont masquées sur mobile pour préserver l'UX.
 */
export function SimulatorFormGrid({ form, results }: SimulatorFormGridProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        {form}
        <AdSlot placement="simulator-below-form" />
      </div>
      <div className="flex flex-col gap-6">
        {results}
        <AdSlot placement="simulator-after-results" />
      </div>
    </div>
  );
}
