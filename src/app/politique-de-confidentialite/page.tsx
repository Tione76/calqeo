import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { LEGAL, LEGAL_LINKS, SITE } from "@/lib/site/config";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Politique de confidentialité de ${SITE.name} : données collectées, cookies, AdSense et vos droits RGPD.`,
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <section>
        <h2 className="text-lg font-semibold text-brand-900">1. Responsable du traitement</h2>
        <p className="mt-2">
          {LEGAL.publisherName} — {LEGAL.publisherAddress}. Contact :{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="text-brand-600 hover:underline">
            {SITE.contactEmail}
          </a>
          . DPO / référent données : {LEGAL.dpoEmail}.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">2. Données collectées</h2>
        <p className="mt-2">
          Les simulateurs fonctionnent localement dans votre navigateur : les valeurs saisies ne
          sont pas transmises à nos serveurs sauf si vous nous contactez volontairement.
        </p>
        <p className="mt-2">Nous pouvons traiter :</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Données de navigation (pages visitées, appareil) via cookies analytics, avec consentement</li>
          <li>Identifiants publicitaires via cookies AdSense, avec consentement</li>
          <li>Votre choix de consentement cookies (stocké localement)</li>
          <li>Logs techniques de l&apos;hébergeur (adresse IP, horodatage) pour la sécurité</li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">3. Google AdSense</h2>
        <p className="mt-2">
          Si vous acceptez les cookies publicitaires, Google AdSense peut afficher des annonces et
          utiliser des cookies pour personnaliser les publicités selon vos centres d&apos;intérêt.
          Google traite ces données en qualité de responsable de traitement distinct. Consultez la{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            politique de confidentialité Google
          </a>{" "}
          et{" "}
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            paramètres des annonces Google
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">4. Base légale & durée</h2>
        <p className="mt-2">
          Cookies nécessaires : intérêt légitime (fonctionnement). Cookies analytics et
          publicitaires : consentement (art. 6.1.a RGPD). Consentement conservé 6 mois maximum.
          Logs hébergeur : durée limitée conformément à l&apos;hébergeur.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">5. Vos droits</h2>
        <p className="mt-2">
          Accès, rectification, effacement, opposition, limitation, portabilité, retrait du
          consentement. Contact : {SITE.contactEmail}. Réclamation possible auprès de la CNIL (
          <a href="https://www.cnil.fr" className="text-brand-600 hover:underline">
            www.cnil.fr
          </a>
          ).
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">6. Cookies</h2>
        <p className="mt-2">
          Détail des cookies dans notre{" "}
          <Link href={LEGAL_LINKS.cookies} className="text-brand-600 hover:underline">
            politique de cookies
          </Link>
          . Vous pouvez modifier vos choix à tout moment via « Gérer mes cookies » en pied de page.
        </p>
      </section>
    </LegalLayout>
  );
}
