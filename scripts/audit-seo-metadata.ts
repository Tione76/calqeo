import { simulators } from "../src/lib/simulators/index";
import { SITE } from "../src/lib/site/config";
import {
  META_DESCRIPTION_MAX,
  META_TITLE_EFFECTIVE_MAX,
  effectiveMetaTitle,
} from "../src/lib/simulators/_shared/seo";

const TITLE_SUFFIX = ` | ${SITE.name}`;

type Row = {
  slug: string;
  title: string;
  effectiveTitle: string;
  titleLen: number;
  description: string;
  descLen: number;
};

const rows: Row[] = simulators.map((s) => ({
  slug: s.slug,
  title: s.metaTitle,
  effectiveTitle: effectiveMetaTitle(s.metaTitle),
  titleLen: effectiveMetaTitle(s.metaTitle).length,
  description: s.metaDescription,
  descLen: s.metaDescription.length,
}));

const titleOffenders = rows.filter((r) => r.titleLen > META_TITLE_EFFECTIVE_MAX);
const descOffenders = rows.filter((r) => r.descLen > META_DESCRIPTION_MAX);
const titleDupes = new Map<string, string[]>();
for (const r of rows) {
  const key = r.effectiveTitle.toLowerCase();
  const list = titleDupes.get(key) ?? [];
  list.push(r.slug);
  titleDupes.set(key, list);
}
const duplicateTitles = [...titleDupes.entries()].filter(([, slugs]) => slugs.length > 1);

console.log(`Simulateurs publiés : ${rows.length}`);
console.log(
  `Titles > ${META_TITLE_EFFECTIVE_MAX} (avec «${TITLE_SUFFIX}») : ${titleOffenders.length}`
);
console.log(`Descriptions > ${META_DESCRIPTION_MAX} : ${descOffenders.length}`);
console.log(`Titles dupliqués : ${duplicateTitles.length}`);

if (titleOffenders.length > 0) {
  console.log("\nTitles encore trop longs :");
  for (const r of titleOffenders.slice(0, 10)) {
    console.log(`  ${r.titleLen} ${r.slug}: ${r.effectiveTitle}`);
  }
}

if (descOffenders.length > 0) {
  console.log("\nDescriptions encore trop longues :");
  for (const r of descOffenders.slice(0, 10)) {
    console.log(`  ${r.descLen} ${r.slug}: ${r.description.slice(0, 90)}…`);
  }
}

if (duplicateTitles.length > 0) {
  console.log("\nDuplicatas de title :");
  for (const [title, slugs] of duplicateTitles.slice(0, 5)) {
    console.log(`  ${title} → ${slugs.join(", ")}`);
  }
}

process.exit(titleOffenders.length + descOffenders.length > 0 ? 1 : 0);
