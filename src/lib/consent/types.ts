export type ConsentCategory = "necessary" | "analytics" | "advertising";

export interface ConsentPreferences {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
}

export const CONSENT_STORAGE_KEY = "sec-cookie-consent-v1";
export const CONSENT_COOKIE_MAX_AGE_DAYS = 180;

export const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true,
  analytics: false,
  advertising: false,
  updatedAt: "",
};

export const ALL_ACCEPTED_CONSENT: ConsentPreferences = {
  necessary: true,
  analytics: true,
  advertising: true,
  updatedAt: "",
};
