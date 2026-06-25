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

  if (ADSENSE_ENABLED && !hasAdConsent) {
    return null;
  }

  if (ADSENSE_ENABLED && hasAdConsent) {
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

  return (
    <aside
      aria-label="Espace publicitaire (démonstration)"
      className={cn(
        "ad-slot ad-slot--demo",
        SIZE_CLASSES[placement],
        breakpointClass,
        className
      )}
      data-ad-placement={placement}
      data-adsense-slot={config.adsenseSlotId}
    >
      <div className="flex h-full min-h-[inherit] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-5 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Publicité · Démonstration
        </p>
        <p className="mt-2 text-sm font-medium text-slate-600">{config.label}</p>
        <p className="mt-1 text-xs text-slate-500">{config.format}</p>
        <p className="mt-0.5 font-mono text-xs text-slate-400">{config.dimensions}</p>
      </div>
    </aside>
  );
}
