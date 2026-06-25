"use client";

import { useConsent } from "./ConsentProvider";

/** Bouton footer pour rouvrir les préférences cookies. */
export function CookieSettingsButton() {
  const { openPreferences } = useConsent();
  return (
    <button
      type="button"
      onClick={openPreferences}
      className="text-sm text-slate-600 transition-colors hover:text-brand-700"
    >
      Gérer mes cookies
    </button>
  );
}
