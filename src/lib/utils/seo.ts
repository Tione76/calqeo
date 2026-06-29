import type { Metadata } from "next";

import type { FAQItem, SimulatorDefinition } from "@/lib/simulators/types";

import { blocksToPlainText } from "@/lib/utils/content";

import { SITE } from "@/lib/site/config";
import manifest from "@/data/simulator-manifest.json";

/** Icônes favicon — glyphe « C » Calqeo (Inter Bold), fichiers dans /public. */
export const SITE_ICONS: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", sizes: "48x48" },
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  ],
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  other: [
    {
      rel: "manifest",
      url: "/site.webmanifest",
    },
  ],
};

export const SITE_MANIFEST = "/site.webmanifest";

export function getSiteUrl(): string {
  return SITE.url;
}

export function getSiteName(): string {
  return SITE.name;
}

type SimulatorMetadataSource = Pick<
  SimulatorDefinition,
  "slug" | "metaTitle" | "metaDescription" | "keywords"
>;

const defaultOpenGraphImages = [
  {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: `${SITE.name} — ${SITE.tagline}`,
  },
];

export function createSimulatorMetadata(
  simulator: SimulatorMetadataSource
): Metadata {
  return {
    title: simulator.metaTitle,
    description: simulator.metaDescription,
    keywords: simulator.keywords,
    alternates: {
      canonical: `/simulateurs/${simulator.slug}`,
    },
    openGraph: {
      title: simulator.metaTitle,
      description: simulator.metaDescription,
      url: `/simulateurs/${simulator.slug}`,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: defaultOpenGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: simulator.metaTitle,
      description: simulator.metaDescription,
      images: ["/twitter-image"],
    },
  };
}

export function createHomeMetadata(): Metadata {
  const defaultTitle = `${SITE.name} — ${SITE.tagline}`;
  const ogDescription =
    "Plus de 100 outils gratuits pour simuler un crédit, calculer un impôt, estimer des travaux ou vérifier votre IMC. Résultats instantanés.";

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    keywords: [
      "simulateur en ligne",
      "calculateur gratuit",
      "simulateur immobilier",
      "calculateur impôt",
      "simulateur crédit",
      "calculateur IMC",
      "calculateur TVA",
      "Calqeo",
    ],
    alternates: {
      canonical: "/",
    },
    icons: SITE_ICONS,
    manifest: SITE_MANIFEST,
    openGraph: {
      title: defaultTitle,
      description: ogDescription,
      url: "/",
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: defaultOpenGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: ogDescription,
      images: ["/twitter-image"],
    },
  };
}

export function createLegalMetadata(
  title: string,
  description: string,
  pathname: string
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      title,
      description,
      url: pathname,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: defaultOpenGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image"],
    },
    robots: { index: true, follow: true },
  };
}

export function jsonLdWebsite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    inLanguage: "fr-FR",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    potentialAction: jsonLdSearchAction(),
  };
}

function jsonLdSearchAction() {
  return {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.url}/?q={search_term_string}#simulateurs`,
    },
    "query-input": "required name=search_term_string",
  };
}

/** Graphe JSON-LD complet pour la page d'accueil (Organization, WebSite, CollectionPage). */
export function jsonLdHomePage() {
  const organizationId = `${SITE.url}/#organization`;
  const websiteId = `${SITE.url}/#website`;
  const webpageId = `${SITE.url}/#webpage`;
  const logoUrl = `${SITE.url}/opengraph-image`;
  const homeTitle = `${SITE.name} — ${SITE.tagline}`;

  const tools = manifest.groups.flatMap((group) => group.all);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        email: SITE.contactEmail,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "fr-FR",
        publisher: { "@id": organizationId },
        potentialAction: jsonLdSearchAction(),
      },
      {
        "@type": "CollectionPage",
        "@id": webpageId,
        url: SITE.url,
        name: homeTitle,
        description: SITE.description,
        inLanguage: "fr-FR",
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: logoUrl,
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Simulateurs et calculateurs Calqeo",
          numberOfItems: manifest.count,
          itemListElement: tools.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tool.title,
            url: `${SITE.url}/simulateurs/${tool.slug}`,
          })),
        },
      },
    ],
  };
}

export function jsonLdFAQ(faq: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: blocksToPlainText(item.blocks),
      },
    })),
  };
}

export function jsonLdBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}
