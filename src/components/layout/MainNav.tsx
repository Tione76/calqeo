"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getDomainNavGroups } from "@/lib/simulators/navigation";

const domainGroups = getDomainNavGroups();

export function MainNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        ref={menuRef}
        className="relative hidden items-center gap-1 md:flex"
        aria-label="Navigation principale"
      >
        <Link
          href="/"
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
        >
          Accueil
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            Outils
            <svg
              className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-[780px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {domainGroups.map((group) => (
                  <div key={group.domain}>
                    <Link
                      href={`/simulateurs#${group.anchor}`}
                      onClick={() => setMenuOpen(false)}
                      className="font-display text-sm font-semibold text-brand-900 hover:text-brand-700"
                    >
                      {group.label}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {group.count} outil{group.count > 1 ? "s" : ""}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {group.featured.map((sim) => (
                        <li key={sim.slug}>
                          <Link
                            href={`/simulateurs/${sim.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="block text-sm text-slate-600 transition-colors hover:text-brand-700"
                          >
                            {sim.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/simulateurs#${group.anchor}`}
                      onClick={() => setMenuOpen(false)}
                      className="mt-3 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Voir les {group.count} →
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <Link
                  href="/simulateurs"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Voir tous les outils →
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-brand-50 md:hidden"
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setMobileOpen((o) => !o)}
      >
        {mobileOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 overflow-y-auto bg-white md:hidden">
          <nav className="container-app py-4" aria-label="Navigation mobile">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-brand-50"
            >
              Accueil
            </Link>
            <Link
              href="/simulateurs"
              onClick={() => setMobileOpen(false)}
              className="mt-1 block rounded-lg px-3 py-3 text-base font-semibold text-brand-900 hover:bg-brand-50"
            >
              Tous les outils
            </Link>
            <div className="mt-4 space-y-2">
              {domainGroups.map((group) => {
                const isExpanded = expandedDomain === group.domain;
                return (
                  <div key={group.domain} className="rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedDomain(isExpanded ? null : group.domain)
                      }
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                      aria-expanded={isExpanded}
                    >
                      <span>
                        <span className="font-semibold text-brand-900">{group.label}</span>
                        <span className="ml-2 text-xs text-slate-400">({group.count})</span>
                      </span>
                      <svg
                        className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <ul className="border-t border-slate-100 px-2 pb-2">
                        {group.all.map((sim) => (
                          <li key={sim.slug}>
                            <Link
                              href={`/simulateurs/${sim.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                            >
                              {sim.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
