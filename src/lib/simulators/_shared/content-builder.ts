import type { ContentBlock, FAQItem, SimulatorContent } from "../types";



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



export function buildRichContent(spec: RichContentSpec): SimulatorContent {

  const howSubsections = [

    {

      id: "definition",

      title: "Définition",

      blocks: [p(spec.definition)],

    },

    {

      id: "objectif",

      title: "Objectif du simulateur",

      blocks: [p(spec.objectif)],

    },

    {

      id: "variables",

      title: "Variables prises en compte",

      blocks: [ul(spec.variables, "Paramètres du formulaire :")],

    },

    {

      id: "formules",

      title: "Formule(s) utilisée(s)",

      blocks: spec.formules,

    },

    {

      id: "interpretation",

      title: "Interprétation du résultat",

      blocks: spec.interpretation,

    },

    {

      id: "limites-calcul",

      title: "Limites du calcul",

      blocks: [ul(spec.limitesCalcul)],

    },

  ];



  if (spec.maillage && spec.maillage.length > 0) {

    howSubsections.push({

      id: "maillage",

      title: "Simulateurs complémentaires",

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

        title: "Comment fonctionne ce calcul ?",

        subtitle: spec.intro,

        subsections: howSubsections,

      },

      {

        id: "exemple-concret",

        title: "Exemple concret",

        subtitle: spec.example.title,

        subsections: [

          {

            id: "exemple-donnees",

            title: "Données saisies",

            blocks: [ul(spec.example.donnees)],

          },

          {

            id: "exemple-calcul",

            title: "Calcul effectué",

            blocks: [ul(spec.example.calcul, undefined, true)],

          },

          {

            id: "exemple-resultat",

            title: "Résultat obtenu",

            blocks: [hl("Résultat", spec.example.resultat)],

          },

          {

            id: "exemple-interpretation",

            title: "Interprétation",

            blocks: [p(spec.example.interpretation)],

          },

        ],

      },

      {

        id: "conseils-limites",

        title: "Conseils et limites",

        subtitle:

          "Ce simulateur fournit une estimation indicative. Les résultats ne remplacent pas un conseil personnalisé.",

        subsections: [

          {

            id: "conseils",

            title: "Conseils pratiques",

            blocks: [ul(spec.conseils)],

          },

          {

            id: "limites",

            title: "Limites du simulateur",

            blocks: [ul(spec.limites)],

          },

        ],

      },

    ],

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


