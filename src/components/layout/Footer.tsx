import Link from "next/link";
import {
  getDomainNavGroups,
  SIMULATOR_COUNT,
} from "@/lib/simulators/navigation";
import { LEGAL_LINKS, SITE } from "@/lib/site/config";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const groups = getDomainNavGroups();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-app py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <div className="sm:col-span-2 lg:col-span-4 xl:col-span-2">
            <h3 className="font-display text-lg font-bold text-brand-900">
              {SITE.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {SIMULATOR_COUNT} simulateurs et calculateurs gratuits : immobilier,
              finance, emploi, entreprises, fiscalité, travaux, santé et quotidien.
              Résultats instantanés, sans inscription.
            </p>
          </div>

          {groups.map((group) => (
            <div key={group.domain}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                <Link
                  href={`/simulateurs#${group.anchor}`}
                  className="hover:text-brand-700"
                >
                  {group.label}
                </Link>
              </h4>
              <ul className="mt-4 space-y-2">
                {group.featured.slice(0, 3).map((sim) => (
                  <li key={sim.slug}>
                    <Link
                      href={`/simulateurs/${sim.slug}`}
                      className="text-sm text-slate-600 transition-colors hover:text-brand-700"
                    >
                      {sim.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/simulateurs#${group.anchor}`}
                className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Voir les {group.count} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 border-t border-slate-100 pt-8 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-700">Informations légales</h4>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <li>
                <Link href={LEGAL_LINKS.mentionsLegales} className="text-slate-600 hover:text-brand-700">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href={LEGAL_LINKS.confidentialite} className="text-slate-600 hover:text-brand-700">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href={LEGAL_LINKS.cookies} className="text-slate-600 hover:text-brand-700">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href={LEGAL_LINKS.cgu} className="text-slate-600 hover:text-brand-700">
                  CGU
                </Link>
              </li>
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Les résultats sont fournis à titre indicatif et ne constituent pas un
            conseil professionnel (juridique, fiscal, financier ou médical).
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6 text-sm text-slate-500">
          <p>© {currentYear} Calqeo. Tous droits réservés.</p>
          <Link href="/simulateurs" className="font-semibold text-brand-600 hover:text-brand-700">
            Tous les outils ({SIMULATOR_COUNT})
          </Link>
        </div>
      </div>
    </footer>
  );
}
