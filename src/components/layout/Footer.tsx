import type { ReactNode } from "react";
import Link from "next/link";
import { getDomainNavGroups } from "@/lib/simulators/navigation";
import { LEGAL_LINKS, SITE } from "@/lib/site/config";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";

const FOOTER_POPULAR_TOOLS = [
  { label: "Capacité d'emprunt", slug: "capacite-emprunt" },
  { label: "Salaire brut / net", slug: "salaire-brut-net" },
  { label: "Reste à vivre", slug: "budget-reste-a-vivre" },
  { label: "Rendement locatif", slug: "rendement-locatif" },
  { label: "Calculateur TVA", slug: "calculateur-tva" },
] as const;

function FooterLegalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-slate-600 transition-colors hover:text-brand-800"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const groups = getDomainNavGroups().filter(
    (group) => group.domain !== "aides-sociales"
  );

  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="container-app py-14 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-0">
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="font-display text-xl font-bold tracking-tight text-brand-900">
              {SITE.name}
            </h3>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-600">
              Des simulateurs gratuits pour estimer, comparer et prendre de
              meilleures décisions au quotidien.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Outils populaires
            </h4>
            <ul className="mt-6 space-y-3.5 text-sm">
              {FOOTER_POPULAR_TOOLS.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/simulateurs/${tool.slug}`}
                    className="text-slate-600 transition-colors hover:text-brand-800"
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Catégories
            </h4>
            <ul className="mt-6 space-y-3.5 text-sm">
              {groups.map((group) => (
                <li key={group.domain}>
                  <Link
                    href={group.path}
                    className="text-slate-600 transition-colors hover:text-brand-800"
                  >
                    {group.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-100 pt-10 lg:mt-16 lg:pt-12">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm"
            aria-label="Liens légaux"
          >
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-slate-600 transition-colors hover:text-brand-800"
            >
              Contact
            </a>
            <span className="text-slate-300" aria-hidden>
              •
            </span>
            <FooterLegalLink href={LEGAL_LINKS.mentionsLegales}>
              Mentions légales
            </FooterLegalLink>
            <span className="text-slate-300" aria-hidden>
              •
            </span>
            <FooterLegalLink href={LEGAL_LINKS.confidentialite}>
              Confidentialité
            </FooterLegalLink>
            <span className="text-slate-300" aria-hidden>
              •
            </span>
            <FooterLegalLink href={LEGAL_LINKS.cookies}>
              Cookies
            </FooterLegalLink>
            <span className="text-slate-300" aria-hidden>
              •
            </span>
            <CookieSettingsButton />
          </nav>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-500">
            Les résultats sont fournis à titre indicatif et ne constituent pas un
            conseil professionnel (juridique, fiscal, financier ou médical).
          </p>

          <p className="mt-6 text-center text-xs text-slate-400">
            © {currentYear} {SITE.name} — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
