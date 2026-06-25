"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  searchSimulators,
  type RegisteredSimulator,
} from "@/lib/simulators/search-client";

interface SimulatorSearchProps {
  placeholder?: string;
  defaultValue?: string;
  /** Filtrage local (ex. grille d'accueil) sans navigation. */
  onSearch?: (query: string) => void;
  /** Soumission vers l'accueil avec ancre #simulateurs. */
  redirectOnSubmit?: boolean;
  /** Variante visuelle : header compact ou champ principal. */
  variant?: "default" | "compact";
  className?: string;
}

const MAX_SUGGESTIONS = 8;

export function SimulatorSearch({
  placeholder = "Rechercher un simulateur…",
  defaultValue = "",
  onSearch,
  redirectOnSubmit = false,
  variant = "default",
  className = "",
}: SimulatorSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      onSearch?.(q);
    }
  }, [searchParams, onSearch]);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return searchSimulators(trimmed).slice(0, MAX_SUGGESTIONS);
  }, [query]);

  useEffect(() => {
    setOpen(query.trim().length > 0);
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateTo = useCallback(
    (sim: RegisteredSimulator) => {
      setOpen(false);
      setQuery("");
      onSearch?.("");
      startTransition(() => {
        router.push(`/simulateurs/${sim.slug}`);
      });
    },
    [router, onSearch]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();

      if (results.length > 0 && activeIndex >= 0) {
        navigateTo(results[activeIndex]);
        return;
      }

      if (results.length === 1) {
        navigateTo(results[0]);
        return;
      }

      if (redirectOnSubmit) {
        startTransition(() => {
          const params = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
          router.push(`/${params}#simulateurs`);
        });
      }

      onSearch?.(trimmed);
      setOpen(false);
    },
    [query, results, activeIndex, navigateTo, redirectOnSubmit, router, onSearch]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
        break;
      case "Enter":
        if (activeIndex >= 0) {
          e.preventDefault();
          navigateTo(results[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const isCompact = variant === "compact";
  const inputClass = isCompact
    ? "w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
    : "w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

  const iconClass = isCompact
    ? "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
    : "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search">
        <div className={iconClass}>
          <svg
            className={`${isCompact ? "h-4 w-4" : "h-5 w-5"} text-slate-400`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            onSearch?.(value.trim());
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={inputClass}
          aria-label="Rechercher un simulateur ou calculateur"
          aria-autocomplete="list"
          aria-controls={open ? listboxId : undefined}
          aria-expanded={open && results.length > 0}
          autoComplete="off"
        />
      </form>

      {open && query.trim() && (
        <div
          className="absolute left-0 right-0 top-full z-[60] mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          role="listbox"
          id={listboxId}
        >
          {results.length > 0 ? (
            <ul className="max-h-[min(70vh,22rem)] overflow-y-auto py-1">
              {results.map((sim, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={sim.slug} role="presentation">
                    <Link
                      href={`/simulateurs/${sim.slug}`}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                        onSearch?.("");
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`block px-4 py-3 transition-colors ${
                        isActive ? "bg-brand-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="block font-medium text-brand-900">
                        {sim.title}
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-brand-600">
                        {sim.domainLabel}
                      </span>
                      <span className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {sim.shortDescription}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-slate-500">
              Aucun simulateur ne correspond à « {query.trim()} ».
            </p>
          )}
        </div>
      )}
    </div>
  );
}
