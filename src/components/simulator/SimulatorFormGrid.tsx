"use client";

import type { FormEvent, ReactNode } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { useScrollToResultsAfterSubmit } from "@/components/simulator/useScrollToResultsAfterSubmit";

interface SimulatorFormGridProps {
  form: ReactNode;
  results: ReactNode;
  /** Résultat prêt à afficher — le scroll attend tant que cette valeur est fausse. */
  isResultReady?: boolean;
}

/**
 * Grille formulaire / résultats avec emplacements publicitaires intégrés.
 * Défile automatiquement vers les résultats après soumission du formulaire.
 */
export function SimulatorFormGrid({
  form,
  results,
  isResultReady = true,
}: SimulatorFormGridProps) {
  const { resultsRef, resultsScrollMarginClassName, requestScrollToResults } =
    useScrollToResultsAfterSubmit({ isResultReady });

  const handleFormSubmitCapture = (event: FormEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLFormElement) {
      requestScrollToResults();
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div
        className="flex flex-col gap-6"
        onSubmitCapture={handleFormSubmitCapture}
      >
        {form}
        <AdSlot placement="simulator-below-form" />
      </div>
      <div className="flex flex-col gap-6">
        <div ref={resultsRef} className={resultsScrollMarginClassName}>
          {results}
        </div>
        <AdSlot placement="simulator-after-results" />
      </div>
    </div>
  );
}
