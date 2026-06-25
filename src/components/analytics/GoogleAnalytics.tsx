"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useAnalyticsConsent } from "@/components/consent/ConsentProvider";
import { GA_ENABLED, GA_MEASUREMENT_ID } from "@/lib/analytics/config";
import {
  buildPagePath,
  initGaConfig,
  trackGaPageView,
} from "@/lib/analytics/gtag";

/**
 * GA4 global — chargé uniquement après consentement « mesure d'audience ».
 * Envoie un page_view à chaque navigation App Router (pathname + query).
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasConsent = useAnalyticsConsent();
  const isReady = useRef(false);
  const lastTrackedPath = useRef<string | null>(null);

  const trackCurrentPage = useCallback(() => {
    const path = buildPagePath(pathname, searchParams);
    if (lastTrackedPath.current === path) return;
    lastTrackedPath.current = path;
    trackGaPageView(path);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!hasConsent) {
      isReady.current = false;
      lastTrackedPath.current = null;
      return;
    }
    if (!isReady.current) return;
    trackCurrentPage();
  }, [hasConsent, trackCurrentPage]);

  if (!GA_ENABLED || !hasConsent) {
    return null;
  }

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          isReady.current = true;
          initGaConfig();
          trackCurrentPage();
        }}
      />
    </>
  );
}
