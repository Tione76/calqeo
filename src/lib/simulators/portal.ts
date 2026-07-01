import portalTreeData from "@/data/portal-tree.json";
import type {
  PortalCategoryNode,
  PortalDomainNode,
  PortalSimulatorIndexEntry,
  PortalTree,
} from "./_shared/portal-tree";
import type { SimulatorCategory, SiteDomain } from "./types";

const portalTree = portalTreeData as PortalTree;

export function getPortalTree(): PortalTree {
  return portalTree;
}

export function isDomainSegment(segment: string): segment is SiteDomain {
  return portalTree.domainIds.includes(segment as SiteDomain);
}

export function getDomainHub(domain: SiteDomain): PortalDomainNode | undefined {
  return portalTree.domains.find((node) => node.id === domain);
}

export function getCategoryHub(
  domain: SiteDomain,
  category: SimulatorCategory
): PortalCategoryNode | undefined {
  return getDomainHub(domain)?.categories.find((node) => node.id === category);
}

export function getSimulatorPortalEntry(
  slug: string
): PortalSimulatorIndexEntry | undefined {
  return portalTree.simulatorIndex[slug];
}

export function getAllCategoryHubParams(): { segment: string; category: string }[] {
  return portalTree.domains.flatMap((domain) =>
    domain.categories.map((category) => ({
      segment: domain.id,
      category: category.id,
    }))
  );
}
