"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { getDomainNavGroups, type DomainNavGroup } from "@/lib/simulators/navigation";

const domainGroups = getDomainNavGroups();
const SITE_HEADER_ID = "site-header";
const POPULAR_LIMIT = 5;

const MENU_TITLE_PREFIXES = [
  /^Simulateur d'/i,
  /^Simulateur de /i,
  /^Calculateur d'/i,
  /^Calculateur de /i,
];

function shortenMenuTitle(title: string): string {
  let result = title.trim();
  for (const prefix of MENU_TITLE_PREFIXES) {
    result = result.replace(prefix, "");
  }
  return result.trim();
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

interface DomainMenuContentProps {
  group: DomainNavGroup;
  onNavigate: () => void;
}

/** Contenu mobile uniquement (accordéon). */
function DomainMenuContent({ group, onNavigate }: DomainMenuContentProps) {
  const popular = group.featured.slice(0, POPULAR_LIMIT);
  const popularLinkClass =
    "block rounded-lg px-2 py-2 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-50 hover:text-brand-700";
  const categoryLinkClass =
    "flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700";

  return (
    <div className="px-3 pb-3 pt-1">
      <div className="mt-1">
        <SectionLabel>Les plus utilisés</SectionLabel>
        <ul
          className="mt-2 space-y-0.5"
          aria-label={`Simulateurs les plus utilisés — ${group.label}`}
        >
          {popular.map((sim) => (
            <li key={sim.slug}>
              <Link
                href={`/simulateurs/${sim.slug}`}
                onClick={onNavigate}
                className={popularLinkClass}
              >
                {shortenMenuTitle(sim.title)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="my-3 border-t border-slate-100" role="separator" />

      <div>
        <SectionLabel>Explorer par thème</SectionLabel>
        <ul
          className="mt-2 space-y-0.5"
          aria-label={`Explorer par thème — ${group.label}`}
        >
          {group.categories.map((category) => (
            <li key={category.id}>
              <Link href={category.path} onClick={onNavigate} className={categoryLinkClass}>
                <ChevronIcon className="h-3 w-3 shrink-0 text-slate-300" />
                <span>
                  {category.label}{" "}
                  <span className="text-slate-400">({category.count})</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={group.path}
        onClick={onNavigate}
        className="mt-3 inline-block text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700"
      >
        Voir les {group.count} outils →
      </Link>
    </div>
  );
}

function DesktopDomainColumn({
  group,
  onNavigate,
}: {
  group: DomainNavGroup;
  onNavigate: () => void;
}) {
  return (
    <div>
      <Link
        href={group.path}
        onClick={onNavigate}
        className="font-display text-sm font-semibold text-brand-900 transition-colors hover:text-brand-700"
      >
        {group.label}
      </Link>
      <ul
        className="mt-2 space-y-1"
        aria-label={`Sous-catégories — ${group.label}`}
      >
        {group.categories.map((category) => (
          <li key={category.id}>
            <Link
              href={category.path}
              onClick={onNavigate}
              className="block rounded-md py-1 text-sm text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MainNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [headerOffset, setHeaderOffset] = useState(64);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenus = () => {
    setMenuOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!mobileOpen) return;

    function syncHeaderOffset() {
      const header = document.getElementById(SITE_HEADER_ID);
      setHeaderOffset(header?.offsetHeight ?? 64);
    }

    syncHeaderOffset();
    window.addEventListener("resize", syncHeaderOffset);
    return () => window.removeEventListener("resize", syncHeaderOffset);
  }, [mobileOpen]);

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
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                {domainGroups.map((group) => (
                  <div key={group.domain}>
                    <DesktopDomainColumn
                      group={group}
                      onNavigate={() => setMenuOpen(false)}
                    />
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

      {mounted &&
        mobileOpen &&
        createPortal(
          <div
            className="fixed inset-x-0 bottom-0 z-[70] overflow-y-auto bg-white md:hidden"
            style={{ top: headerOffset }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation mobile"
          >
            <nav className="container-app py-4" aria-label="Navigation mobile">
              <Link
                href="/"
                onClick={closeMenus}
                className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-brand-50"
              >
                Accueil
              </Link>
              <Link
                href="/simulateurs"
                onClick={closeMenus}
                className="mt-1 block rounded-lg px-3 py-3 text-base font-semibold text-brand-900 hover:bg-brand-50"
              >
                Tous les outils
              </Link>
              <div className="mt-4 space-y-2">
                {domainGroups.map((group) => {
                  const isExpanded = expandedDomain === group.domain;
                  return (
                    <div key={group.domain} className="rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between gap-2 px-4 py-3">
                        <Link
                          href={group.path}
                          onClick={closeMenus}
                          className="min-w-0 flex-1"
                        >
                          <span className="font-display font-semibold text-brand-900 hover:text-brand-700">
                            {group.label}
                          </span>
                          <span className="ml-2 text-xs text-slate-400">
                            {group.count} outil{group.count > 1 ? "s" : ""}
                          </span>
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedDomain(isExpanded ? null : group.domain)
                          }
                          className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-brand-50 hover:text-brand-700"
                          aria-expanded={isExpanded}
                          aria-label={
                            isExpanded
                              ? `Replier ${group.label}`
                              : `Déplier ${group.label}`
                          }
                        >
                          <svg
                            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-slate-100">
                          <DomainMenuContent group={group} onNavigate={closeMenus} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>,
          document.body
        )}
    </>
  );
}
