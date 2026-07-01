import type { FAQItem } from "../types";
import type { PortalCategoryNode, PortalDomainNode } from "./portal-tree";

function faqAnswer(text: string): FAQItem["blocks"] {
  return [{ type: "paragraph", text }];
}

export function buildDomainHubIntro(domain: PortalDomainNode): string {
  const categoryNames = domain.categories.map((c) => c.label.toLowerCase()).join(", ");
  return `Retrouvez ${domain.count} simulateurs et calculateurs ${domain.label.toLowerCase()} sur Calqeo : ${categoryNames}. Outils gratuits, sans inscription, résultats instantanés.`;
}

export function buildCategoryHubIntro(
  domain: PortalDomainNode,
  category: PortalCategoryNode
): string {
  return `${category.count} outil${category.count > 1 ? "s" : ""} dédié${category.count > 1 ? "s" : ""} à ${category.label.toLowerCase()} dans l'univers ${domain.label.toLowerCase()}. Comparez, estimez et simulez en ligne.`;
}

export function buildDomainHubFaq(domain: PortalDomainNode): FAQItem[] {
  return [
    {
      question: `Quels simulateurs ${domain.label.toLowerCase()} sont disponibles ?`,
      blocks: faqAnswer(
        `${domain.count} outils gratuits couvrent ${domain.categories.map((c) => c.label.toLowerCase()).join(", ")}. Chaque simulateur produit une estimation instantanée à partir de vos données.`
      ),
    },
    {
      question: "Les simulateurs sont-ils gratuits ?",
      blocks: faqAnswer(
        "Oui. Tous les outils Calqeo sont accessibles sans inscription et sans frais. Les résultats sont indicatifs et ne remplacent pas un conseil professionnel."
      ),
    },
    {
      question: "Comment trouver le bon outil ?",
      blocks: faqAnswer(
        `Parcourez les sous-catégories (${domain.categories.map((c) => c.label).join(", ")}) ou utilisez la recherche depuis la page d'accueil pour accéder directement au simulateur adapté.`
      ),
    },
  ];
}

export function buildCategoryHubFaq(
  domain: PortalDomainNode,
  category: PortalCategoryNode
): FAQItem[] {
  return [
    {
      question: `Quels outils ${category.label.toLowerCase()} propose Calqeo ?`,
      blocks: faqAnswer(
        `${category.count} simulateur${category.count > 1 ? "s" : ""} couvre${category.count > 1 ? "nt" : ""} ${category.label.toLowerCase()} dans le domaine ${domain.label.toLowerCase()}.`
      ),
    },
    {
      question: "Comment choisir le bon simulateur ?",
      blocks: faqAnswer(
        "Consultez la description de chaque outil ci-dessous. Les simulateurs mis en avant regroupent les cas les plus consultés de cette sous-catégorie."
      ),
    },
    {
      question: "Les résultats sont-ils fiables ?",
      blocks: faqAnswer(
        "Les calculs s'appuient sur des formules et barèmes publics. Vérifiez vos entrées et consultez un professionnel pour toute décision importante."
      ),
    },
  ];
}
