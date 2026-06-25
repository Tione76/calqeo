"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CookieBanner = dynamic(
  () =>
    import("./CookieBanner").then((mod) => ({
      default: mod.CookieBanner,
    })),
  { ssr: false }
);

/**
 * Affiche la bannière cookies après le rendu initial (idle / 1,5 s max)
 * pour ne pas concurrencer le LCP du hero avec le texte légal.
 */
export function DeferredCookieBanner() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const show = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(show, { timeout: 2000 });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }

    const id = setTimeout(show, 1500);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, []);

  if (!ready) return null;
  return <CookieBanner />;
}
