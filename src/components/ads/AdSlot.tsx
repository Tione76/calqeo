"use client";

import { AD_PLACEMENTS, ADSENSE_ENABLED, type AdPlacementId } from "@/lib/ads";
import { cn } from "@/lib/utils/cn";
import { useAdvertisingConsent } from "@/components/consent/ConsentProvider";

interface AdSlotProps {
  placement: AdPlacementId;
  className?: string;
}

const SIZE_CLASSES: Record<AdPlacementId, string> = {
  "simulator-below-form":
    "min-h-[50px] sm:min-h-[90px] w-full max-w-[728px] mx-auto",
  "simulator-after-results":
    "min-h-[50px] sm:min-h-[90px] w-full max-w-[728px] mx-auto",
  "simulator-in-content":
    "min-h-[250px] w-full max-w-[336px] sm:max-w-none mx-auto",
  "simulator-before-faq":
    "min-h-[50px] sm:min-h-[90px] w-full max-w-[728px] mx-auto",
  "simulator-sidebar": "min-h-[250px] w-[300px]",
};

const BREAKPOINT_CLASSES: Record<
  NonNullable<(typeof AD_PLACEMENTS)[AdPlacementId]["minBreakpoint"]>,
  string
> = {
  sm: "hidden sm:block",
  md: "hidden md:block",
  lg: "hidden lg:block",
};

export function AdSlot({ placement, className }: AdSlotProps) {
  const hasAdConsent = useAdvertisingConsent();
  const config = AD_PLACEMENTS[placement];
  const breakpointClass = config.minBreakpoint
    ? BREAKPOINT_CLASSES[config.minBreakpoint]
    : undefined;

  if (!ADSENSE_ENABLED || !hasAdConsent) {
    return null;
  }

  return (
    <aside
      aria-label="Publicité"
      className={cn(
        "ad-slot ad-slot--live",
        SIZE_CLASSES[placement],
        breakpointClass,
        className
      )}
      data-ad-placement={placement}
      data-adsense-slot={config.adsenseSlotId}
    >
      {/* Unité AdSense — chargée après consentement publicitaire */}
    </aside>
  );
}
