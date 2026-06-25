import searchIndex from "@/data/simulator-search-index.json";
import type { SiteDomain, SimulatorIcon } from "@/lib/simulators/types";

export interface SearchableSimulator {
  slug: string;
  title: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  icon: SimulatorIcon;
  domain: SiteDomain;
  domainLabel: string;
  keywords: string[];
}

const index = searchIndex as SearchableSimulator[];

export function searchSimulators(query: string): SearchableSimulator[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return index;

  return index.filter((s) => {
    const haystack = [
      s.title,
      s.metaTitle,
      s.shortDescription,
      s.metaDescription,
      s.category,
      s.domain,
      s.domainLabel,
      ...s.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return normalized.split(/\s+/).every((word) => haystack.includes(word));
  });
}

export type { SearchableSimulator as RegisteredSimulator };
