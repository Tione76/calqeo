"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE } from "@/lib/site/config";

const CALQEO_TAGLINE = "Simuler, calculer, décider";

function CalqeoWordmark() {
  return (
    <Link
      href="/"
      className="flex shrink-0 flex-col justify-center leading-none"
      aria-label={`Calqeo — ${CALQEO_TAGLINE}`}
    >
      <span className="font-display text-[1.4625rem] font-bold tracking-tight text-slate-900 sm:text-[1.625rem]">
        Calqe<span className="text-brand-600">o</span>
      </span>
      <span className="mt-0.5 text-[10px] font-normal text-slate-500 sm:text-[11px]">
        {CALQEO_TAGLINE}
      </span>
    </Link>
  );
}

export function HeaderLogo() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <CalqeoWordmark />;
  }

  return (
    <Link href="/" className="flex shrink-0 items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z"
          />
        </svg>
      </div>
      <div className="hidden sm:block">
        <span className="font-display text-lg font-bold text-brand-900">
          {SITE.name}
        </span>
      </div>
    </Link>
  );
}
