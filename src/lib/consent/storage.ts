import {
  ALL_ACCEPTED_CONSENT,
  CONSENT_STORAGE_KEY,
  DEFAULT_CONSENT,
  type ConsentPreferences,
} from "./types";

export function parseConsent(raw: string | null): ConsentPreferences | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as ConsentPreferences;
    if (typeof data.analytics !== "boolean" || typeof data.advertising !== "boolean") {
      return null;
    }
    return { ...data, necessary: true };
  } catch {
    return null;
  }
}

export function readConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  return parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
}

export function saveConsent(prefs: Omit<ConsentPreferences, "necessary" | "updatedAt">): ConsentPreferences {
  const value: ConsentPreferences = {
    necessary: true,
    analytics: prefs.analytics,
    advertising: prefs.advertising,
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("consent-updated", { detail: value }));
  }
  return value;
}

export function acceptAllConsent(): ConsentPreferences {
  return saveConsent({ analytics: true, advertising: true });
}

export function rejectOptionalConsent(): ConsentPreferences {
  return saveConsent({ analytics: false, advertising: false });
}

export function hasConsentChoice(): boolean {
  return readConsent() !== null;
}

export function hasAdvertisingConsent(): boolean {
  return readConsent()?.advertising ?? false;
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics ?? false;
}

export { ALL_ACCEPTED_CONSENT, DEFAULT_CONSENT };
