import type { MetadataRoute } from "next";
import { getPortalTree } from "@/lib/simulators/portal";
import { getSiteUrl } from "@/lib/utils/seo";
import { LEGAL_LINKS } from "@/lib/site/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const portalTree = getPortalTree();

  const domainHubPages = portalTree.domains.map((domain) => ({
    url: `${baseUrl}${domain.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const categoryHubPages = portalTree.domains.flatMap((domain) =>
    domain.categories.map((category) => ({
      url: `${baseUrl}${category.path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }))
  );

  const simulatorPages = Object.keys(portalTree.simulatorIndex).map((slug) => ({
    url: `${baseUrl}/simulateurs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const legalPages = [
    LEGAL_LINKS.mentionsLegales,
    LEGAL_LINKS.confidentialite,
    LEGAL_LINKS.cookies,
    LEGAL_LINKS.cgu,
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/simulateurs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...domainHubPages,
    ...categoryHubPages,
    ...simulatorPages,
    ...legalPages,
  ];
}
