import type { Metadata } from "next";

import type { FAQItem, SimulatorDefinition } from "@/lib/simulators/types";

import { blocksToPlainText } from "@/lib/utils/content";

import { SITE } from "@/lib/site/config";

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

    },

    twitter: {

      card: "summary_large_image",

      title: simulator.metaTitle,

      description: simulator.metaDescription,

    },

  };

}



export function createHomeMetadata(): Metadata {

  return {

    title: {
      default: `${SITE.name} — Simulateurs et calculateurs gratuits en ligne`,
      template: `%s | ${SITE.name}`,
    },
    description:
      "Simulateurs et calculateurs en ligne gratuits : immobilier, crédit, impôts, travaux, santé. Estimez, calculez et comparez vos résultats instantanément.",

    keywords: [

      "simulateur en ligne",

      "calculateur gratuit",

      "simulateur immobilier",

      "calculateur impôt",

      "simulateur crédit",

      "calculateur IMC",

      "calculateur TVA",

    ],

    alternates: {

      canonical: "/",

    },

    openGraph: {

      title: `${SITE.name} — Simulateurs et calculateurs gratuits`,
      description:
        "Plus de 80 outils gratuits pour simuler un crédit, calculer un impôt, estimer des travaux ou vérifier votre IMC. Résultats instantanés.",

      url: "/",

      siteName: SITE.name,

      locale: SITE.locale,

      type: "website",

    },

  };

}



export function createLegalMetadata(title: string, description: string): Metadata {

  return {

    title,

    description,

    alternates: { canonical: `/${title.toLowerCase().replace(/\s+/g, "-")}` },

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

    potentialAction: {

      "@type": "SearchAction",

      target: {

        "@type": "EntryPoint",

        urlTemplate: `${SITE.url}/?q={search_term_string}#simulateurs`,

      },

      "query-input": "required name=search_term_string",

    },

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


