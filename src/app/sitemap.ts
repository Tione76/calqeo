import type { MetadataRoute } from "next";
import { simulators } from "@/lib/simulators";
import { getSiteUrl } from "@/lib/utils/seo";
import { LEGAL_LINKS } from "@/lib/site/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const simulatorPages = simulators.map((sim) => ({
    url: `${baseUrl}/simulateurs/${sim.slug}`,
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
    ...simulatorPages,
    ...legalPages,
  ];
}
