/**
 * Marque favicon Calqeo — glyphe « C » extrait d'Inter Bold (700),
 * identique au C du wordmark HeaderLogo (font-display / font-bold).
 */

export const FAVICON_LETTER = "C" as const;
export const FAVICON_FOREGROUND = "#000000";
export const FAVICON_BACKGROUND = "#FFFFFF";

/** Inter Bold latin — même graisse que le logo (`font-bold`). */
export const INTER_BOLD_FONT_FILE =
  "node_modules/@fontsource/inter/files/inter-latin-700-normal.woff";

export interface FaviconMarkOptions {
  size?: number;
  viewBox?: number;
  padding?: number;
}

/** Construit le SVG du favicon à partir d'un tracé Inter Bold pré-calculé. */
export function buildFaviconSvg(
  pathData: string,
  transform: string,
  options: FaviconMarkOptions = {}
): string {
  const size = options.size ?? 32;
  const viewBox = options.viewBox ?? 100;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${viewBox} ${viewBox}" role="img" aria-label="Calqeo">
  <rect width="${viewBox}" height="${viewBox}" fill="${FAVICON_BACKGROUND}"/>
  <g transform="${transform}">
    <path d="${pathData}" fill="${FAVICON_FOREGROUND}"/>
  </g>
</svg>`;
}

/** Marge intérieure normalisée (viewBox 100) — lisible dès 16×16 px. */
export const FAVICON_VIEWBOX = 100;
export const FAVICON_PADDING = 12;
