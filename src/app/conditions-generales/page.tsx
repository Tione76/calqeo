import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { LEGAL_LINKS, SITE } from "@/lib/site/config";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: `Conditions générales d'utilisation du site ${SITE.name}.`,
};

export default function CguPage() {
  return (
    <LegalLayout title="Conditions générales d'utilisation">
      <section>
        <h2 className="text-lg font-semibold text-brand-900">1. Objet</h2>
        <p className="mt-2">
          Les présentes CGU régissent l&apos;accès et l&apos;utilisation du site {SITE.name},
          éditeur de simulateurs et calculateurs en ligne gratuits.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">2. Accès au service</h2>
        <p className="mt-2">
          Le site est accessible gratuitement. L&apos;éditeur s&apos;efforce d&apos;assurer la
          disponibilité du service mais peut suspendre l&apos;accès pour maintenance sans préavis.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">3. Nature des résultats</h2>
        <p className="mt-2">
          Les résultats des simulateurs sont fournis à titre indicatif et pédagogique. Ils ne
          remplacent pas l&apos;avis d&apos;un professionnel qualifié (notaire, expert-comptable,
          médecin, conseiller financier…). L&apos;utilisateur reste seul responsable de ses
          décisions.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">4. Propriété intellectuelle</h2>
        <p className="mt-2">
          Tous les contenus du site sont protégés. Toute extraction ou réutilisation systématique
          est interdite sans autorisation écrite.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">5. Publicité</h2>
        <p className="mt-2">
          Le site peut contenir des espaces publicitaires (Google AdSense). L&apos;éditeur n&apos;est
          pas responsable du contenu des sites tiers accessibles via des liens publicitaires.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">6. Données personnelles</h2>
        <p className="mt-2">
          Voir la{" "}
          <Link href={LEGAL_LINKS.confidentialite} className="text-brand-600 hover:underline">
            politique de confidentialité
          </Link>{" "}
          et la{" "}
          <Link href={LEGAL_LINKS.cookies} className="text-brand-600 hover:underline">
            politique de cookies
          </Link>
          .
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">7. Droit applicable</h2>
        <p className="mt-2">
          Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux
          français seront compétents.
        </p>
      </section>
    </LegalLayout>
  );
}
