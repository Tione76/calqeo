import { notFound } from "next/navigation";
import {
  getAllSimulatorSlugs,
  getRelatedSimulators,
  getSimulatorBySlug,
} from "@/lib/simulators";
import { DOMAIN_ANCHORS, DOMAIN_LABELS, getSimulatorDomain } from "@/lib/simulators/types";
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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSimulatorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const simulator = getSimulatorBySlug(slug);
  if (!simulator) return {};
  return createSimulatorMetadata(simulator);
}

export default async function SimulatorPage({ params }: PageProps) {
  const { slug } = await params;
  const simulator = getSimulatorBySlug(slug);

  if (!simulator) {
    notFound();
  }

  const FormComponent = getSimulatorForm(slug);
  if (!FormComponent) {
    notFound();
  }

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

  const domain = getSimulatorDomain(simulator);
  const breadcrumbJsonLd = jsonLdBreadcrumb([
    { name: "Accueil", url: "/" },
    { name: "Outils", url: "/simulateurs" },
    { name: DOMAIN_LABELS[domain], url: `/simulateurs#${DOMAIN_ANCHORS[domain]}` },
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
          domain={domain}
          category={simulator.category}
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
