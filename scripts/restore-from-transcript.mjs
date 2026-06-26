import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const transcript =
  "C:/Users/denis/.cursor/projects/c-Users-denis-Simulateurs-et-Calculateurs/agent-transcripts/ed569a92-8af0-4ef2-9dfa-9b4c20328456/subagents/74cddfa2-4ce1-4a66-88ee-43e81ca91a54.jsonl";

const targets = [
  "src/lib/simulators/drafts/travaux/index.ts",
  "src/lib/simulators/drafts/sante/index.ts",
  "src/lib/simulators/drafts/quotidien/index.ts",
];

const lines = fs.readFileSync(transcript, "utf8").split("\n");
for (const rel of targets) {
  const needle = rel.replace(/\//g, "\\\\");
  for (const line of lines) {
    if (!line.includes(rel) && !line.includes(needle)) continue;
    try {
      const obj = JSON.parse(line);
      const write = obj.message?.content?.find((c) => c.type === "tool_use" && c.name === "Write" && c.input?.path?.includes(rel.split("/").pop()));
      if (write?.input?.contents) {
        const out = path.join(__dirname, "..", rel);
        fs.writeFileSync(out, write.input.contents);
        console.log("Restored", rel, write.input.contents.length, "chars");
        break;
      }
    } catch {
      /* continue */
    }
  }
}
