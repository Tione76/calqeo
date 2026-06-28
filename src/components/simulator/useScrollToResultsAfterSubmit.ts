"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Marge supérieure au scroll — alignée sur le header sticky (`scroll-mt-24` ailleurs sur le site). */
const RESULTS_SCROLL_MARGIN_CLASS = "scroll-mt-24";

interface UseScrollToResultsAfterSubmitOptions {
  /** Indique que le bloc résultat contient un calcul affiché (pas le placeholder vide). */
  isResultReady?: boolean;
}

/**
 * Défilement fluide vers le bloc résultats après soumission du formulaire.
 * Appeler `requestScrollToResults()` dans le handler de submit.
 */
export function useScrollToResultsAfterSubmit(
  options: UseScrollToResultsAfterSubmitOptions = {}
) {
  const { isResultReady = true } = options;
  const resultsRef = useRef<HTMLDivElement>(null);
  const [pendingScroll, setPendingScroll] = useState(false);

  const requestScrollToResults = useCallback(() => {
    setPendingScroll(true);
  }, []);

  useEffect(() => {
    if (!pendingScroll || !isResultReady) return;

    const target = resultsRef.current;
    if (!target) return;

    let cancelled = false;

    const performScroll = () => {
      if (cancelled) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingScroll(false);
    };

    // Double rAF : attendre le commit React et la mise en page avant le scroll.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(performScroll);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [pendingScroll, isResultReady]);

  return {
    resultsRef,
    resultsScrollMarginClassName: RESULTS_SCROLL_MARGIN_CLASS,
    requestScrollToResults,
  };
}
