import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/site/config";

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="container-app py-10 sm:py-14">
      <nav aria-label="Fil d'Ariane" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <li>
            <Link href="/" className="hover:text-brand-700">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-brand-900">{title}</li>
        </ol>
      </nav>
      <article className="prose-legal mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-brand-900">{title}</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">{children}</div>
      </article>
      <p className="mx-auto mt-10 max-w-3xl text-xs text-slate-500">
        Dernière mise à jour : juin 2025. Consultez aussi{" "}
        <Link href={LEGAL_LINKS.confidentialite} className="text-brand-600 hover:underline">
          la politique de confidentialité
        </Link>{" "}
        et{" "}
        <Link href={LEGAL_LINKS.cookies} className="text-brand-600 hover:underline">
          la politique de cookies
        </Link>
        .
      </p>
    </div>
  );
}
