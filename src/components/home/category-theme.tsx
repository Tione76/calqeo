import type { SiteDomain } from "@/lib/simulators/types";

export type CategoryTheme = {
  /** Couleur principale — titres, filets, CTA. */
  accent: string;
  /** Hover liens et CTA. */
  accentHover: string;
  /** Fond illustration / badges. */
  accentBg: string;
  /** Bordures cartes et séparateurs. */
  accentBorder: string;
  /** Touches colorées dans les illustrations. */
  accentSoft: string;
  /** Lavis de section desktop (scroll perceptible). */
  sectionWash: string;
};

/** Palette Calqeo — identité distincte par univers (homepage desktop). */
export const HOME_CATEGORY_THEMES: Record<SiteDomain, CategoryTheme> = {
  immobilier: {
    accent: "#3F6B52",
    accentHover: "#325744",
    accentBg: "#E8F2EB",
    accentBorder: "#B8D4C0",
    accentSoft: "#8FB89A",
    sectionWash: "#F6FAF7",
  },
  finance: {
    accent: "#1A5563",
    accentHover: "#144652",
    accentBg: "#E6F1F4",
    accentBorder: "#A8C8D1",
    accentSoft: "#6BA3B3",
    sectionWash: "#F2F8FA",
  },
  emploi: {
    accent: "#2E4A8C",
    accentHover: "#243D75",
    accentBg: "#EBEFF8",
    accentBorder: "#B3C0DF",
    accentSoft: "#7A94C9",
    sectionWash: "#F3F5FC",
  },
  entreprise: {
    accent: "#C26F2E",
    accentHover: "#A85F27",
    accentBg: "#FBF0E6",
    accentBorder: "#E8C4A0",
    accentSoft: "#E0A878",
    sectionWash: "#FDF8F4",
  },
  fiscalite: {
    accent: "#4E3D6B",
    accentHover: "#3F3158",
    accentBg: "#F0ECF5",
    accentBorder: "#C4B5D6",
    accentSoft: "#9A87B5",
    sectionWash: "#F7F5FA",
  },
  travaux: {
    accent: "#A85A3F",
    accentHover: "#8F4D36",
    accentBg: "#FAF0EB",
    accentBorder: "#E0B8A5",
    accentSoft: "#D4957A",
    sectionWash: "#FBF6F3",
  },
  sante: {
    accent: "#C45A5A",
    accentHover: "#A84D4D",
    accentBg: "#FAEEEE",
    accentBorder: "#E5B8B8",
    accentSoft: "#E09898",
    sectionWash: "#FDF7F7",
  },
  quotidien: {
    accent: "#2D8686",
    accentHover: "#247070",
    accentBg: "#E8F5F5",
    accentBorder: "#A8D4D4",
    accentSoft: "#6DB8B8",
    sectionWash: "#F2FAFA",
  },
  "aides-sociales": {
    accent: "#3F6B52",
    accentHover: "#325744",
    accentBg: "#E8F2EB",
    accentBorder: "#B8D4C0",
    accentSoft: "#8FB89A",
    sectionWash: "#F6FAF7",
  },
};

export function getCategoryTheme(domain: SiteDomain): CategoryTheme {
  return HOME_CATEGORY_THEMES[domain] ?? HOME_CATEGORY_THEMES.quotidien;
}
