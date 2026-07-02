import { notFound } from "next/navigation";
import {
  buildDomainHubFaq,
  buildDomainHubIntro,
} from "@/lib/simulators/_shared/portal-content";
import type { PortalDomainNode } from "@/lib/simulators/_shared/portal-tree";
import { getDomainHub, getPortalTree, isDomainSegment } from "@/lib/simulators/portal";
import { getSimulatorBySlug } from "@/lib/simulators";
import {
  createDomainHubMetadata,
  jsonLdBreadcrumb,
  jsonLdFAQ,
  jsonLdPortalHub,
} from "@/lib/utils/seo";
import { blocksToPlainText } from "@/lib/utils/content";
import {
  FeaturedSimulatorLinks,
  PortalBreadcrumb,
  PortalCategoryLinks,
  PortalDomainLinks,
  PortalLightFaq,
  SimulatorCardGrid,
} from "@/components/portal/PortalHub";
import { SimulatorCategoryIllustration } from "@/components/simulator/SimulatorCategoryIllustration";
import {
  generateSimulatorMetadata,
  getSimulatorStaticParams,
  SimulatorPageContent,
} from "@/components/simulator/SimulatorPageContent";

interface PageProps {
  params: Promise<{ segment: string }>;
}

export async function generateStaticParams() {
  const tree = getPortalTree();
  const domainParams = tree.domainIds.map((segment) => ({ segment }));
  return [...domainParams, ...getSimulatorStaticParams()];
}

export async function generateMetadata({ params }: PageProps) {
  const { segment } = await params;

  if (isDomainSegment(segment)) {
    const hub = getDomainHub(segment);
    if (!hub) return {};
    return createDomainHubMetadata(hub);
  }

  return generateSimulatorMetadata(segment);
}

function DomainHubView({ hub }: { hub: PortalDomainNode }) {
  const tree = getPortalTree();
  const intro = buildDomainHubIntro(hub);
  const faq = buildDomainHubFaq(hub);

  const breadcrumbJsonLd = jsonLdBreadcrumb([
    { name: "Accueil", url: "/" },
    { name: "Outils", url: "/simulateurs" },
    { name: hub.label, url: hub.path },
  ]);

  const hubJsonLd = jsonLdPortalHub({
    name: `Simulateurs ${hub.label}`,
    description: intro,
    path: hub.path,
    items: hub.categories.flatMap((category) => category.simulators),
  });

  const faqJsonLd = jsonLdFAQ(faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container-app py-10 sm:py-14">
        <PortalBreadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Outils", href: "/simulateurs" },
            { label: hub.label },
          ]}
        />

        <header className="mb-10">
          <div className="flex items-start gap-4">
            <SimulatorCategoryIllustration
              domain={hub.id}
              size="mobile-header"
              className="md:hidden"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium uppercase tracking-wider text-brand-600">
                Domaine · {hub.count} outil{hub.count > 1 ? "s" : ""}
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
                Simulateurs {hub.label.toLowerCase()}
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">{intro}</p>
              <FeaturedSimulatorLinks featured={hub.featured} />
            </div>
          </div>
        </header>

        <section aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="font-display text-xl font-bold text-brand-900">
            Sous-catégories
          </h2>
          <div className="mt-4">
            <PortalCategoryLinks
              categories={hub.categories.map((category) => ({
                label: category.label,
                path: category.path,
                count: category.count,
              }))}
            />
          </div>
        </section>

        <div className="mt-12 space-y-16">
          {hub.categories.map((category) => (
            <section key={category.id} aria-labelledby={`${category.id}-heading`}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2
                    id={`${category.id}-heading`}
                    className="font-display text-2xl font-bold text-brand-900"
                  >
                    {category.label}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {category.count} outil{category.count > 1 ? "s" : ""}
                  </p>
                </div>
                <a
                  href={category.path}
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Voir la page {category.label.toLowerCase()} →
                </a>
              </div>
              <div className="mt-6">
                <SimulatorCardGrid simulators={category.simulators.slice(0, 6)} />
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16" aria-labelledby="other-domains-heading">
          <h2 id="other-domains-heading" className="font-display text-xl font-bold text-brand-900">
            Autres domaines
          </h2>
          <div className="mt-4">
            <PortalDomainLinks
              domains={tree.domains.map((domain) => ({
                label: domain.label,
                path: domain.path,
                count: domain.count,
              }))}
              currentPath={hub.path}
            />
          </div>
        </section>

        <PortalLightFaq
          items={faq.map((item) => ({
            question: item.question,
            answer: blocksToPlainText(item.blocks),
          }))}
        />
      </div>
    </>
  );
}

export default async function SegmentPage({ params }: PageProps) {
  const { segment } = await params;

  if (isDomainSegment(segment)) {
    const hub = getDomainHub(segment);
    if (!hub) notFound();
    return <DomainHubView hub={hub} />;
  }

  if (!getSimulatorBySlug(segment)) {
    notFound();
  }

  return <SimulatorPageContent slug={segment} />;
}
