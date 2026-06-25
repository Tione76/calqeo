import Link from "next/link";
import type { ContentBlock } from "@/lib/simulators/types";

interface ContentBlocksProps {
  blocks: ContentBlock[];
  className?: string;
}

export function ContentBlocks({ blocks, className = "" }: ContentBlocksProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={key}
                className="text-sm leading-relaxed text-slate-600"
              >
                {block.text}
              </p>
            );

          case "list":
            return (
              <div key={key}>
                {block.title && (
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    {block.title}
                  </p>
                )}
                {block.ordered ? (
                  <ol className="ml-4 list-decimal space-y-2 text-sm leading-relaxed text-slate-600">
                    {block.items.map((item) => (
                      <li key={item.slice(0, 30)}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <ul className="space-y-2">
                    {block.items.map((item) => (
                      <li
                        key={item.slice(0, 30)}
                        className="flex gap-3 text-sm leading-relaxed text-slate-600"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );

          case "highlight":
            return (
              <div
                key={key}
                className={`rounded-xl border p-4 ${
                  block.variant === "warning"
                    ? "border-amber-200 bg-amber-50"
                    : "border-brand-200 bg-brand-50"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    block.variant === "warning"
                      ? "text-amber-900"
                      : "text-brand-900"
                  }`}
                >
                  {block.title}
                </p>
                <p
                  className={`mt-1 text-sm leading-relaxed ${
                    block.variant === "warning"
                      ? "text-amber-800"
                      : "text-brand-800"
                  }`}
                >
                  {block.text}
                </p>
              </div>
            );

          case "steps":
            return (
              <div key={key} className="space-y-3">
                {block.items.map((step) => (
                  <div
                    key={step.label}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        {step.label}
                      </span>
                      <span className="font-semibold text-brand-700">
                        {step.value}
                      </span>
                    </div>
                    {step.detail && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {step.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );

          case "links":
            return (
              <div key={key}>
                {block.title && (
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    {block.title}
                  </p>
                )}
                <ul className="flex flex-wrap gap-2">
                  {block.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="inline-flex rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 transition hover:border-brand-300 hover:bg-brand-100"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
