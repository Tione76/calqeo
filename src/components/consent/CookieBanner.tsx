"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useConsent } from "./ConsentProvider";
import { LEGAL_LINKS } from "@/lib/site/config";
import { Button } from "@/components/ui/Button";

export function CookieBanner() {
  const {
    hasChosen,
    acceptAll,
    rejectOptional,
    openPreferences,
    preferencesOpen,
    closePreferences,
    updatePreferences,
    consent,
  } = useConsent();

  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    if (preferencesOpen && consent) {
      setAnalytics(consent.analytics);
      setAdvertising(consent.advertising);
    }
  }, [preferencesOpen, consent]);

  if (hasChosen && !preferencesOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white p-4 shadow-2xl sm:p-6"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <div className="container-app">
        {!preferencesOpen ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 id="cookie-banner-title" className="font-display text-lg font-semibold text-brand-900">
                Respect de votre vie privée
              </h2>
              <p id="cookie-banner-desc" className="mt-2 text-sm leading-relaxed text-slate-600">
                Nous utilisons des cookies nécessaires au fonctionnement du site. Avec votre
                accord, nous pouvons aussi utiliser des cookies de mesure d&apos;audience et de
                publicité personnalisée (Google AdSense). Vous pouvez accepter, refuser ou
                personnaliser vos choix.{" "}
                <Link href={LEGAL_LINKS.cookies} className="font-medium text-brand-600 hover:underline">
                  En savoir plus
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={openPreferences}>
                Personnaliser
              </Button>
              <Button variant="secondary" size="sm" onClick={rejectOptional}>
                Tout refuser
              </Button>
              <Button size="sm" onClick={acceptAll}>
                Tout accepter
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-display text-lg font-semibold text-brand-900">
              Paramètres des cookies
            </h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">Cookies nécessaires</p>
                <p className="mt-1 text-sm text-slate-600">
                  Indispensables au fonctionnement et à la mémorisation de vos choix. Toujours
                  actifs.
                </p>
                <p className="mt-2 text-xs font-semibold text-brand-600">Activés</p>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
                <span>
                  <span className="font-medium text-slate-900">Cookies de mesure d&apos;audience</span>
                  <span className="mt-1 block text-sm text-slate-600">
                    Nous aident à comprendre l&apos;utilisation du site (statistiques anonymisées).
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={advertising}
                  onChange={(e) => setAdvertising(e.target.checked)}
                />
                <span>
                  <span className="font-medium text-slate-900">Cookies publicitaires</span>
                  <span className="mt-1 block text-sm text-slate-600">
                    Permettent l&apos;affichage de publicités via Google AdSense et la mesure de
                    leur performance.
                  </span>
                </span>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={closePreferences}>
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={() => updatePreferences({ analytics, advertising })}
              >
                Enregistrer mes choix
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Bouton footer pour rouvrir les préférences cookies. */
export { CookieSettingsButton } from "./CookieSettingsButton";
