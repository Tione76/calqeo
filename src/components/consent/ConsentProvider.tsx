"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  acceptAllConsent,
  readConsent,
  rejectOptionalConsent,
  saveConsent,
} from "@/lib/consent/storage";
import type { ConsentPreferences } from "@/lib/consent/types";

interface ConsentContextValue {
  consent: ConsentPreferences | null;
  hasChosen: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  updatePreferences: (prefs: Pick<ConsentPreferences, "analytics" | "advertising">) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  preferencesOpen: boolean;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);
  const [hasChosen, setHasChosen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setHasChosen(stored !== null);

    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<ConsentPreferences>).detail;
      setConsent(detail);
      setHasChosen(true);
    };
    window.addEventListener("consent-updated", onUpdate);
    return () => window.removeEventListener("consent-updated", onUpdate);
  }, []);

  const acceptAll = useCallback(() => {
    setConsent(acceptAllConsent());
    setHasChosen(true);
    setPreferencesOpen(false);
  }, []);

  const rejectOptional = useCallback(() => {
    setConsent(rejectOptionalConsent());
    setHasChosen(true);
    setPreferencesOpen(false);
  }, []);

  const updatePreferences = useCallback(
    (prefs: Pick<ConsentPreferences, "analytics" | "advertising">) => {
      setConsent(saveConsent(prefs));
      setHasChosen(true);
      setPreferencesOpen(false);
    },
    []
  );

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasChosen,
        acceptAll,
        rejectOptional,
        updatePreferences,
        openPreferences: () => setPreferencesOpen(true),
        closePreferences: () => setPreferencesOpen(false),
        preferencesOpen,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within ConsentProvider");
  }
  return ctx;
}

export function useAdvertisingConsent(): boolean {
  const ctx = useContext(ConsentContext);
  return ctx?.consent?.advertising ?? false;
}

export function useAnalyticsConsent(): boolean {
  const ctx = useContext(ConsentContext);
  return ctx?.consent?.analytics ?? false;
}
