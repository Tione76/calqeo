import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildCategoryHubFaq,
  buildCategoryHubIntro,
} from "@/lib/simulators/_shared/portal-content";
import type { PortalCategoryNode, PortalDomainNode } from "@/lib/simulators/_shared/portal-tree";
import { getCategoryHub, getDomainHub, getPortalTree } from "@/lib/simulators/portal";
import type { SimulatorCategory, SiteDomain } from "@/lib/simulators/types";
import {
  createCategoryHubMetadata,
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

interface PageProps {
  params: Promise<{ segment: string; category: string }>;
}

export async function generateStaticParams() {
  return getPortalTree().domains.flatMap((domain) =>
    domain.categories.map((category) => ({
      segment: domain.id,
      category: category.id,
    }))
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { segment, category } = await params;
  const domain = getDomainHub(segment as SiteDomain);
  const categoryHub = getCategoryHub(segment as SiteDomain, category as SimulatorCategory);
  if (!domain || !categoryHub) return {};
  return createCategoryHubMetadata(domain, categoryHub);
}

function CategoryHubView({
  domain,
  category,
}: {
  domain: PortalDomainNode;
  category: PortalCategoryNode;
}) {
  const tree = getPortalTree();
  const intro = buildCategoryHubIntro(domain, category);
  const faq = buildCategoryHubFaq(domain, category);
  const breadcrumbJsonLd = jsonLdBreadcrumb([
    { name: "Accueil", url: "/" },
    { name: "Outils", url: "/simulateurs" },
    { name: domain.label, url: domain.path },
    { name: category.label, url: category.path },
  ]);

  const hubJsonLd = jsonLdPortalHub({
    name: `${category.label} — ${domain.label}`,
    description: intro,
    path: category.path,
    items: category.simulators,
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
            { label: domain.label, href: domain.path },
            { label: category.label },
          ]}
        />

        <header className="mb-10">
          <div className="flex items-start gap-4">
            <SimulatorCategoryIllustration
              domain={domain.id}
              size="mobile-header"
              className="md:hidden"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium uppercase tracking-wider text-brand-600">
                {domain.label} · {category.label}
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
                Simulateurs {category.label.toLowerCase()}
              </h1>
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">{intro}</p>
              <FeaturedSimulatorLinks featured={category.featured} />
            </div>
          </div>
        </header>

        <section aria-labelledby="sibling-categories-heading">
          <h2
            id="sibling-categories-heading"
            className="font-display text-xl font-bold text-brand-900"
          >
            Autres sous-catégories
          </h2>
          <div className="mt-4">
            <PortalCategoryLinks
              categories={domain.categories.map((node) => ({
                label: node.label,
                path: node.path,
                count: node.count,
              }))}
              currentPath={category.path}
            />
          </div>
        </section>

        <section className="mt-12" aria-labelledby="simulators-heading">
          <h2 id="simulators-heading" className="font-display text-2xl font-bold text-brand-900">
            Tous les outils
          </h2>
          <div className="mt-6">
            <SimulatorCardGrid simulators={category.simulators} />
          </div>
        </section>

        <section className="mt-16" aria-labelledby="domain-link-heading">
          <h2 id="domain-link-heading" className="font-display text-xl font-bold text-brand-900">
            Explorer d&apos;autres domaines
          </h2>
          <div className="mt-4">
            <Link
              href={domain.path}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              ← Retour aux simulateurs {domain.label.toLowerCase()}
            </Link>
          </div>
          <div className="mt-6">
            <PortalDomainLinks
              domains={tree.domains
                .filter((node) => node.id !== domain.id)
                .map((node) => ({
                  label: node.label,
                  path: node.path,
                  count: node.count,
                }))}
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

export default async function CategoryHubPage({ params }: PageProps) {
  const { segment, category: categoryId } = await params;
  const domain = getDomainHub(segment as SiteDomain);
  const category = getCategoryHub(segment as SiteDomain, categoryId as SimulatorCategory);

  if (!domain || !category) {
    notFound();
  }

  return <CategoryHubView domain={domain} category={category} />;
}
