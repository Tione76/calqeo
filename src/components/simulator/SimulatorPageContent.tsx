import { notFound } from "next/navigation";
import {
  getAllSimulatorSlugs,
  getRelatedSimulators,
  getSimulatorBySlug,
} from "@/lib/simulators";
import { getSimulatorPortalEntry } from "@/lib/simulators/portal";
import { DOMAIN_LABELS, getSimulatorDomain } from "@/lib/simulators/types";
import { createSimulatorMetadata, jsonLdBreadcrumb, jsonLdFAQ } from "@/lib/utils/seo";
import { jsonLdSoftwareApplication } from "@/lib/simulators/_shared/seo";
import { getSimulatorForm } from "@/components/simulator/forms";
import { SimulatorHeader } from "@/components/simulator/SimulatorHeader";
import { SimulatorContent } from "@/components/simulator/SimulatorContent";
import { SimulatorFAQ } from "@/components/simulator/SimulatorFAQ";
import { RelatedSimulators } from "@/components/simulator/RelatedSimulators";
import { RegulatorySourcesNotice } from "@/components/simulator/RegulatorySourcesNotice";
import { AdSlot } from "@/components/ads/AdSlot";
import { ADSENSE_ENABLED } from "@/lib/ads";
import { cn } from "@/lib/utils/cn";

interface SimulatorPageContentProps {
  slug: string;
}

export async function generateSimulatorMetadata(slug: string) {
  const simulator = getSimulatorBySlug(slug);
  if (!simulator) return {};
  return createSimulatorMetadata(simulator);
}

export function SimulatorPageContent({ slug }: SimulatorPageContentProps) {
  const simulator = getSimulatorBySlug(slug);

  if (!simulator) {
    notFound();
  }

  const FormComponent = getSimulatorForm(slug);
  if (!FormComponent) {
    notFound();
  }

  const portalEntry = getSimulatorPortalEntry(slug);
  const domain = getSimulatorDomain(simulator);
  const domainPath = portalEntry?.domainPath ?? `/simulateurs/${domain}`;
  const categoryPath =
    portalEntry?.categoryPath ?? `${domainPath}/${simulator.category}`;
  const domainLabel = portalEntry?.domainLabel ?? DOMAIN_LABELS[domain];
  const categoryLabel =
    portalEntry?.primaryCategoryLabel ?? simulator.category;

  const related = getRelatedSimulators(slug).map((sim) => {
    const simDomain = getSimulatorDomain(sim);
    return {
      slug: sim.slug,
      title: sim.title,
      shortDescription: sim.shortDescription,
      icon: sim.icon,
      category: sim.category,
      domain: simDomain,
      domainLabel: DOMAIN_LABELS[simDomain],
    };
  });

  const breadcrumbJsonLd = jsonLdBreadcrumb([
    { name: "Accueil", url: "/" },
    { name: "Outils", url: "/simulateurs" },
    { name: domainLabel, url: domainPath },
    { name: categoryLabel, url: categoryPath },
    { name: simulator.title, url: `/simulateurs/${simulator.slug}` },
  ]);

  const faqJsonLd = jsonLdFAQ(simulator.faq);
  const appJsonLd = jsonLdSoftwareApplication(simulator, domain);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />

      <div className="container-app py-10 sm:py-14">
        <SimulatorHeader
          title={simulator.title}
          description={simulator.shortDescription}
          domainLabel={domainLabel}
          domainPath={domainPath}
          categoryLabel={categoryLabel}
          categoryPath={categoryPath}
          icon={simulator.icon}
        />

        <div
          className={cn(
            ADSENSE_ENABLED &&
              "lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8"
          )}
        >
          <div className="min-w-0">
            <FormComponent />

            {simulator.regulationIds && simulator.regulationIds.length > 0 && (
              <div className="mt-10">
                <RegulatorySourcesNotice regulationIds={simulator.regulationIds} />
              </div>
            )}

            <div className="mt-16 space-y-16">
              <SimulatorContent content={simulator.content} />
              <AdSlot placement="simulator-before-faq" />
              <SimulatorFAQ items={simulator.faq} />
              <RelatedSimulators simulators={related} />
            </div>
          </div>

          {ADSENSE_ENABLED && (
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <AdSlot placement="simulator-sidebar" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function getSimulatorStaticParams() {
  return getAllSimulatorSlugs().map((slug) => ({ segment: slug }));
}
