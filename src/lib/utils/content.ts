import type { ContentBlock } from "@/lib/simulators/types";

export function blocksToPlainText(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return block.text;
        case "list":
          return [
            block.title ?? "",
            ...block.items.map((item) => `• ${item}`),
          ].join(" ");
        case "highlight":
          return `${block.title} ${block.text}`;
        case "steps":
          return block.items
            .map(
              (step) =>
                `${step.label}: ${step.value}${step.detail ? ` — ${step.detail}` : ""}`
            )
            .join(" ");
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join(" ");
}
