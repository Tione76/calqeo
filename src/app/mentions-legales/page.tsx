import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { LEGAL, SITE } from "@/lib/site/config";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${SITE.name} : éditeur, hébergeur et responsabilité.`,
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales">
      <section>
        <h2 className="text-lg font-semibold text-brand-900">1. Éditeur du site</h2>
        <p className="mt-2">
          Le site {SITE.name} ({SITE.url}) est édité par :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Dénomination : {LEGAL.publisherName}</li>
          <li>Forme juridique : {LEGAL.publisherLegalForm}</li>
          <li>Adresse : {LEGAL.publisherAddress}</li>
          <li>SIRET : {LEGAL.publisherSiret}</li>
          <li>Responsable de la publication : {LEGAL.publisherDirector}</li>
          <li>
            Contact :{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-brand-600 hover:underline">
              {SITE.contactEmail}
            </a>
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">2. Hébergement</h2>
        <p className="mt-2">
          Le site est hébergé par {LEGAL.hostName}, {LEGAL.hostAddress}.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">3. Propriété intellectuelle</h2>
        <p className="mt-2">
          L&apos;ensemble des contenus (textes, graphismes, logos, simulateurs) est protégé par
          le droit d&apos;auteur. Toute reproduction non autorisée est interdite.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">4. Limitation de responsabilité</h2>
        <p className="mt-2">
          Les simulateurs et calculateurs fournissent des résultats indicatifs. Ils ne
          constituent pas un conseil juridique, fiscal, financier ou médical. L&apos;éditeur ne
          saurait être tenu responsable des décisions prises sur la base des résultats affichés.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">5. Publicité</h2>
        <p className="mt-2">
          Le site peut afficher des annonces publicitaires via Google AdSense. Google et ses
          partenaires peuvent utiliser des cookies pour diffuser des annonces personnalisées,
          sous réserve de votre consentement. Voir la politique de cookies pour plus
          d&apos;informations.
        </p>
      </section>
    </LegalLayout>
  );
}
