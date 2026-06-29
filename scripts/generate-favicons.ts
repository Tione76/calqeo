/**
 * Génère les favicons Calqeo à partir du glyphe « C » d'Inter Bold (700),
 * identique au C du wordmark du site (HeaderLogo — Inter, font-bold).
 *
 * Usage : npm run generate:favicons
 */

import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";
import toIco from "to-ico";
import {
  buildFaviconSvg,
  FAVICON_LETTER,
  FAVICON_PADDING,
  FAVICON_VIEWBOX,
} from "../src/lib/brand/favicon-mark";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const FONT_PATH = path.join(
  ROOT,
  "node_modules",
  "@fontsource",
  "inter",
  "files",
  "inter-latin-700-normal.woff"
);

function loadInterBoldFont(): opentype.Font {
  if (!fs.existsSync(FONT_PATH)) {
    throw new Error(
      "Police Inter Bold introuvable. Exécutez « npm install » puis relancez le script."
    );
  }

  return opentype.loadSync(FONT_PATH);
}

function buildMarkTransform(font: opentype.Font): {
  pathData: string;
  transform: string;
} {
  const fontSize = 100;
  const glyphPath = font.getPath(FAVICON_LETTER, 0, fontSize * 0.76, fontSize);
  const bbox = glyphPath.getBoundingBox();
  const glyphWidth = bbox.x2 - bbox.x1;
  const glyphHeight = bbox.y2 - bbox.y1;
  const inner = FAVICON_VIEWBOX - FAVICON_PADDING * 2;
  const scale = inner / Math.max(glyphWidth, glyphHeight);
  const translateX =
    (FAVICON_VIEWBOX - glyphWidth * scale) / 2 - bbox.x1 * scale;
  const translateY =
    (FAVICON_VIEWBOX - glyphHeight * scale) / 2 - bbox.y1 * scale;

  return {
    pathData: glyphPath.toPathData(),
    transform: `translate(${translateX.toFixed(4)}, ${translateY.toFixed(4)}) scale(${scale.toFixed(6)})`,
  };
}

async function renderPng(svg: string, size: number): Promise<Buffer> {
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

async function writePng(
  svg: string,
  outputPath: string,
  size: number
): Promise<Buffer> {
  const png = await renderPng(svg, size);
  fs.writeFileSync(outputPath, png);
  return png;
}

async function main(): Promise<void> {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const font = loadInterBoldFont();
  const mark = buildMarkTransform(font);

  const masterSvg = buildFaviconSvg(mark.pathData, mark.transform, {
    size: FAVICON_VIEWBOX,
    viewBox: FAVICON_VIEWBOX,
  });

  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.svg"), masterSvg);

  const png16 = await writePng(
    buildFaviconSvg(mark.pathData, mark.transform, { size: 16 }),
    path.join(PUBLIC_DIR, "favicon-16x16.png"),
    16
  );
  const png32 = await writePng(
    buildFaviconSvg(mark.pathData, mark.transform, { size: 32 }),
    path.join(PUBLIC_DIR, "favicon-32x32.png"),
    32
  );
  const png48 = await renderPng(
    buildFaviconSvg(mark.pathData, mark.transform, { size: 48 }),
    48
  );
  await writePng(
    buildFaviconSvg(mark.pathData, mark.transform, { size: 180 }),
    path.join(PUBLIC_DIR, "apple-touch-icon.png"),
    180
  );
  await writePng(
    buildFaviconSvg(mark.pathData, mark.transform, { size: 192 }),
    path.join(PUBLIC_DIR, "android-chrome-192x192.png"),
    192
  );
  await writePng(
    buildFaviconSvg(mark.pathData, mark.transform, { size: 512 }),
    path.join(PUBLIC_DIR, "android-chrome-512x512.png"),
    512
  );

  const ico = await toIco([png16, png32, png48], { resize: false });
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), ico);

  const manifest = {
    name: "Calqeo",
    short_name: "Calqeo",
    description: "Simulateurs et calculateurs en ligne gratuits",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  fs.writeFileSync(
    path.join(PUBLIC_DIR, "site.webmanifest"),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  console.log("Favicons générés dans public/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
