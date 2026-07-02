import type { SiteDomain } from "@/lib/simulators/types";

const CATEGORY_IMAGE_DIR = "/images/home/categories";

const HOME_CATEGORY_IMAGE_FILES: Record<SiteDomain, string> = {
  immobilier: "Immobilier.png",
  finance: "Finances personnelles.png",
  emploi: "Emploi et salaire.png",
  entreprise: "Entreprises et indépendants.png",
  fiscalite: "Fiscalite.png",
  travaux: "Travaux et habitat.png",
  sante: "Sante.png",
  quotidien: "Calculs du quotidien.png",
  "aides-sociales": "Calculs du quotidien.png",
};

export function getHomeCategoryIllustrationSrc(domain: SiteDomain): string {
  const filename = HOME_CATEGORY_IMAGE_FILES[domain];
  return `${CATEGORY_IMAGE_DIR}/${encodeURIComponent(filename)}`;
}
