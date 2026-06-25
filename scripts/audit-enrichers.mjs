import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!p.includes("_shared")) walk(p, acc);
    } else if (name.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

const files = [
  "immobilier",
  "finance",
  "emploi",
  "fiscalite",
  "entreprise",
  "sante",
  "travaux",
  "quotidien",
  "slugs",
];

const all = new Set();
for (const d of files) {
  const p = `src/lib/simulators/_shared/results/enrichers/${d}.ts`;
  const content = readFileSync(p, "utf8");
  const matches = [...content.matchAll(/^\s+"([a-z0-9-]+)":/gm)].map((m) => m[1]);
  console.log(`${d}: ${matches.length}`);
  matches.forEach((s) => all.add(s));
}
console.log(`Total unique in files: ${all.size}`);

const simFiles = walk("src/lib/simulators");
const expected = new Set();
for (const f of simFiles) {
  const c = readFileSync(f, "utf8");
  for (const m of c.matchAll(/slug:\s*"([a-z0-9-]+)"/g)) expected.add(m[1]);
}
console.log(`Expected simulators: ${expected.size}`);
const missing = [...expected].filter((s) => !all.has(s));
const extra = [...all].filter((s) => !expected.has(s));
console.log("Missing:", missing.length ? missing.join(", ") : "none");
console.log("Extra:", extra.length ? extra.join(", ") : "none");
