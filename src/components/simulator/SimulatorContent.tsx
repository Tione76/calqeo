import type { SimulatorContent as SimulatorContentType } from "@/lib/simulators/types";
import { Card } from "@/components/ui/Card";
import { ContentBlocks } from "@/components/simulator/ContentBlocks";
import { AdSlot } from "@/components/ads/AdSlot";
import { Fragment } from "react";

interface SimulatorContentProps {
  content: SimulatorContentType;
}

export function SimulatorContent({ content }: SimulatorContentProps) {
  return (
    <div className="space-y-16">
      {content.sections.map((section, sectionIndex) => (
        <Fragment key={section.id}>
          <section aria-labelledby={`${section.id}-heading`}>
            <h2 id={`${section.id}-heading`} className="section-title">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="section-subtitle">{section.subtitle}</p>
            )}

            {section.blocks && section.blocks.length > 0 && (
              <Card className="mt-8">
                <ContentBlocks blocks={section.blocks} />
              </Card>
            )}

            {section.subsections && section.subsections.length > 0 && (
              <div className="mt-8 space-y-8">
                {section.subsections.map((subsection, index) => (
                  <Card
                    key={subsection.id}
                    className={
                      index === 0 && section.id.includes("exemple")
                        ? "border-[#B8D4C0]/50 bg-[#F6FAF7]/80"
                        : ""
                    }
                  >
                    <h3 className="font-display text-lg font-semibold text-brand-900">
                      {subsection.title}
                    </h3>
                    <div className="mt-4">
                      <ContentBlocks blocks={subsection.blocks} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {sectionIndex === 0 && (
            <AdSlot placement="simulator-in-content" className="my-4" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
