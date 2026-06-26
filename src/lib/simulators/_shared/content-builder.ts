import type { ContentBlock, FAQItem, SimulatorContent } from "../types";
import {
  getSimulatorHeadings,
  type SimulatorHeadings,
} from "./content/simulator-headings";



export function buildContent(params: {

  intro: string;

  howItWorks: { title: string; blocks: ContentBlock[] }[];

  example?: { title: string; blocks: ContentBlock[] };

  conseils: string[];

  limites: string[];

}): SimulatorContent {

  return {

    sections: [

      {

        id: "comment-fonctionne",

        title: "Comment fonctionne ce calcul ?",

        subtitle: params.intro,

        subsections: params.howItWorks.map((section, i) => ({

          id: `how-${i}`,

          title: section.title,

          blocks: section.blocks,

        })),

      },

      ...(params.example

        ? [

            {

              id: "exemple-concret",

              title: "Exemple concret",

              subtitle: params.example.title,

              subsections: [

                {

                  id: "exemple-detail",

                  title: "Cas pratique chiffré",

                  blocks: params.example.blocks,

                },

              ],

            },

          ]

        : []),

      {

        id: "conseils-limites",

        title: "Conseils et limites",

        subtitle:

          "Repères pour interpréter vos résultats et éviter les erreurs courantes.",

        subsections: [

          {

            id: "conseils",

            title: "Conseils pratiques",

            blocks: [{ type: "list" as const, items: params.conseils }],

          },

          {

            id: "limites",

            title: "Limites du simulateur",

            blocks: [{ type: "list" as const, items: params.limites }],

          },

        ],

      },

    ],

  };

}



/** Structure SEO enrichie pour les pages simulateur. */

export interface RichContentSpec {

  slug?: string;

  intro: string;

  definition: string;

  objectif: string;

  variables: string[];

  formules: ContentBlock[];

  interpretation: ContentBlock[];

  limitesCalcul: string[];

  example: {

    title: string;

    donnees: string[];

    calcul: string[];

    resultat: string;

    interpretation: string;

  };

  maillage?: { slug: string; label: string }[];

  conseils: string[];

  limites: string[];

}



export function buildRichContent(
  spec: RichContentSpec,
  slug?: string
): SimulatorContent {
  const resolvedSlug = slug ?? spec.slug ?? "";
  const h: SimulatorHeadings = getSimulatorHeadings(resolvedSlug);

  const howSubsections = [

    {

      id: "definition",

      title: h.definition,

      blocks: [p(spec.definition)],

    },

    {

      id: "objectif",

      title: h.objectif,

      blocks: [p(spec.objectif)],

    },

    {

      id: "variables",

      title: h.variables,

      blocks: [ul(spec.variables, "Paramètres du formulaire :")],

    },

    {

      id: "formules",

      title: h.formules,

      blocks: spec.formules,

    },

    {

      id: "interpretation",

      title: h.interpretation,

      blocks: spec.interpretation,

    },

    {

      id: "limites-calcul",

      title: h.limitesCalcul,

      blocks: [ul(spec.limitesCalcul)],

    },

  ];



  if (spec.maillage && spec.maillage.length > 0) {

    howSubsections.push({

      id: "maillage",

      title: h.maillage,

      blocks: [

        p("Pour affiner votre analyse, vous pouvez croiser ce résultat avec d'autres outils :"),

        relatedLinks(spec.maillage),

      ],

    });

  }



  return {

    sections: [

      {

        id: "comment-fonctionne",

        title: h.mainSection,

        subtitle: spec.intro,

        subsections: howSubsections,

      },

      {

        id: "exemple-concret",

        title: h.exempleSection,

        subtitle: spec.example.title,

        subsections: [

          {

            id: "exemple-donnees",

            title: h.exempleDonnees,

            blocks: [ul(spec.example.donnees)],

          },

          {

            id: "exemple-calcul",

            title: h.exempleCalcul,

            blocks: [ul(spec.example.calcul, undefined, true)],

          },

          {

            id: "exemple-resultat",

            title: h.exempleResultat,

            blocks: [hl("Résultat", spec.example.resultat)],

          },

          {

            id: "exemple-interpretation",

            title: h.exempleInterpretation,

            blocks: [p(spec.example.interpretation)],

          },

        ],

      },

      {

        id: "conseils-limites",

        title: h.conseilsSection,

        subtitle:

          "Ce simulateur fournit une estimation indicative. Les résultats ne remplacent pas un conseil personnalisé.",

        subsections: [

          {

            id: "conseils",

            title: h.conseils,

            blocks: [ul(spec.conseils)],

          },

          {

            id: "limites",

            title: h.limites,

            blocks: [ul(spec.limites)],

          },

        ],

      },

    ],

  };

}



/** Assemble contenu enrichi + FAQ en passant le slug pour les titres SEO manuels. */
export function registryEntry(
  slug: string,
  spec: Omit<RichContentSpec, "slug">,
  faqItems: { question: string; answer: string | ContentBlock[] }[]
): { content: SimulatorContent; faq: FAQItem[] } {
  return {
    content: buildRichContent(spec, slug),
    faq: buildFaq(faqItems),
  };
}



export function buildFaq(

  items: { question: string; answer: string | ContentBlock[] }[]

): FAQItem[] {

  return items.map((item) => ({

    question: item.question,

    blocks:

      typeof item.answer === "string"

        ? [{ type: "paragraph", text: item.answer }]

        : item.answer,

  }));

}



export function p(text: string): ContentBlock {

  return { type: "paragraph", text };

}



export function hl(title: string, text: string, variant?: "info" | "warning"): ContentBlock {

  return { type: "highlight", title, text, variant };

}



export function ul(items: string[], title?: string, ordered = false): ContentBlock {

  return { type: "list", title, items, ordered };

}



export function relatedLinks(

  items: { slug: string; label: string }[]

): ContentBlock {

  return {

    type: "links",

    items: items.map(({ slug, label }) => ({

      href: `/simulateurs/${slug}`,

      label,

    })),

  };

}


