import { GA_MEASUREMENT_ID } from "./config";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function buildPagePath(
  pathname: string,
  searchParams: URLSearchParams | null
): string {
  const query = searchParams?.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function trackGaPageView(pagePath: string): void {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", { page_path: pagePath });
}

export function initGaConfig(): void {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}
