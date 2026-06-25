import manifest from "@/data/simulator-manifest.json";
import type { SimulatorCategory, SimulatorIcon, SiteDomain } from "./types";

export interface SimulatorNavRef {
  slug: string;
  title: string;
}

export interface SimulatorCardRef extends SimulatorNavRef {
  shortDescription: string;
  icon: SimulatorIcon;
  category: SimulatorCategory;
  domain: SiteDomain;
  domainLabel: string;
}

export interface DomainNavGroup {
  domain: SiteDomain;
  label: string;
  anchor: string;
  count: number;
  featured: SimulatorNavRef[];
  preview: SimulatorCardRef[];
  all: SimulatorCardRef[];
}

export const SIMULATOR_COUNT = manifest.count;

export function getDomainNavGroups(): DomainNavGroup[] {
  return manifest.groups as DomainNavGroup[];
}

export function getSimulatorsGroupedByDomain(): DomainNavGroup[] {
  return getDomainNavGroups();
}

export function getGenericFormSlugs(): ReadonlySet<string> {
  return new Set(manifest.genericFormSlugs);
}

/** @deprecated Utiliser getDomainNavGroups */
export function getCategoryNavGroups() {
  return getDomainNavGroups();
}

export function getSimulatorsGroupedByCategory() {
  return getSimulatorsGroupedByDomain();
}
