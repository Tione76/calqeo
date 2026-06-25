"use client";

import Link from "next/link";

const CALQEO_TAGLINE = "Simuler, calculer, décider";

export function HeaderLogo() {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 flex-col items-center justify-center leading-none"
      aria-label={`Calqeo — ${CALQEO_TAGLINE}`}
    >
      <span className="font-display text-[1.4625rem] font-bold tracking-tight text-slate-900 sm:text-[1.625rem] lg:text-4xl lg:tracking-tight xl:text-[2.75rem]">
        Calqe<span className="text-brand-600">o</span>
      </span>
      <span className="mt-1 text-center text-[10px] font-normal text-slate-500 sm:text-[11px] lg:mt-1.5">
        {CALQEO_TAGLINE}
      </span>
    </Link>
  );
}
