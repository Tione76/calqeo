import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { createLegalMetadata } from "@/lib/utils/seo";
import { LEGAL_LINKS } from "@/lib/site/config";

export const metadata: Metadata = createLegalMetadata(
  "Politique de confidentialité",
  "Politique de confidentialité de Calqeo : données collectées, cookies, Google Analytics, AdSense et vos droits RGPD.",
  LEGAL_LINKS.confidentialite
);

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <section>
        <p className="font-medium text-slate-800">
          <strong>Dernière mise à jour : juin 2026</strong>
        </p>
        <p className="mt-4">
          Chez <strong>Calqeo</strong>, la protection de vos données personnelles est une
          priorité.
        </p>
        <p className="mt-2">
          La présente politique de confidentialité explique quelles données peuvent être
          collectées lors de votre navigation sur le site, pourquoi elles sont utilisées et
          quels sont vos droits conformément au Règlement Général sur la Protection des
          Données (RGPD).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">
          1. Responsable du traitement
        </h2>
        <p className="mt-2">Le responsable du traitement des données est :</p>
        <p className="mt-2">
          <strong>Antoine Denis</strong>
          <br />
          E-mail :{" "}
          <a
            href="mailto:denis.antoine@live.fr"
            className="text-brand-600 hover:underline"
          >
            denis.antoine@live.fr
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">2. Données collectées</h2>
        <p className="mt-2">
          Lors de votre utilisation de Calqeo, les données suivantes peuvent être collectées
          :
        </p>

        <h3 className="mt-4 text-base font-semibold text-brand-900">
          Données fournies volontairement
        </h3>
        <p className="mt-2">
          Lorsque vous utilisez le formulaire de contact ou nous contactez par e-mail :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>nom (si renseigné)</li>
          <li>adresse e-mail</li>
          <li>contenu du message</li>
        </ul>

        <h3 className="mt-4 text-base font-semibold text-brand-900">
          Données techniques
        </h3>
        <p className="mt-2">
          Lors de votre navigation, certaines informations techniques peuvent être
          automatiquement collectées :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>adresse IP (anonymisée lorsque cela est possible)</li>
          <li>type de navigateur</li>
          <li>système d&apos;exploitation</li>
          <li>appareil utilisé</li>
          <li>langue</li>
          <li>pages consultées</li>
          <li>durée des visites</li>
          <li>provenance de la visite</li>
          <li>informations techniques nécessaires au bon fonctionnement du site</li>
        </ul>

        <h3 className="mt-4 text-base font-semibold text-brand-900">
          Données saisies dans les simulateurs
        </h3>
        <p className="mt-2">
          Les informations que vous saisissez dans les simulateurs (revenus, charges,
          montant d&apos;un prêt, âge, IMC, etc.) sont utilisées uniquement pour réaliser le
          calcul demandé.
        </p>
        <p className="mt-2">
          Ces données ne sont pas enregistrées sur nos serveurs et ne sont pas utilisées pour
          vous identifier.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">
          3. Finalités du traitement
        </h2>
        <p className="mt-2">
          Les données collectées sont utilisées uniquement afin de :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>assurer le bon fonctionnement du site ;</li>
          <li>améliorer l&apos;expérience utilisateur ;</li>
          <li>mesurer l&apos;audience du site ;</li>
          <li>répondre aux demandes de contact ;</li>
          <li>assurer la sécurité du site ;</li>
          <li>respecter les obligations légales.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">4. Base légale</h2>
        <p className="mt-2">Les traitements réalisés reposent selon les cas sur :</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            votre consentement (cookies, mesure d&apos;audience, publicité) ;
          </li>
          <li>
            l&apos;intérêt légitime de l&apos;éditeur (sécurité, amélioration du service) ;
          </li>
          <li>le respect des obligations légales.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">5. Cookies</h2>
        <p className="mt-2">Le site utilise différents types de cookies.</p>

        <h3 className="mt-4 text-base font-semibold text-brand-900">
          Cookies strictement nécessaires
        </h3>
        <p className="mt-2">Ils permettent notamment :</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>le fonctionnement du site ;</li>
          <li>la sécurité ;</li>
          <li>la mémorisation de certaines préférences techniques.</li>
        </ul>
        <p className="mt-2">Ces cookies ne nécessitent pas votre consentement.</p>

        <h3 className="mt-4 text-base font-semibold text-brand-900">
          Cookies de mesure d&apos;audience
        </h3>
        <p className="mt-2">
          Avec votre accord, Calqeo peut utiliser des outils d&apos;analyse afin de
          comprendre :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>les pages les plus consultées ;</li>
          <li>les simulateurs les plus utilisés ;</li>
          <li>les performances du site.</li>
        </ul>
        <p className="mt-2">
          Ces statistiques sont utilisées uniquement afin d&apos;améliorer le site.
        </p>

        <h3 className="mt-4 text-base font-semibold text-brand-900">
          Cookies publicitaires
        </h3>
        <p className="mt-2">
          Sous réserve de votre consentement, des partenaires publicitaires tels que{" "}
          <strong>Google AdSense</strong> peuvent déposer des cookies afin de personnaliser
          les annonces affichées.
        </p>
        <p className="mt-2">
          Vous pouvez modifier vos préférences à tout moment depuis le gestionnaire de
          cookies.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">6. Google Analytics</h2>
        <p className="mt-2">
          Calqeo peut utiliser <strong>Google Analytics</strong> afin d&apos;obtenir des
          statistiques anonymisées sur la fréquentation du site.
        </p>
        <p className="mt-2">
          Ces informations permettent notamment d&apos;améliorer les performances,
          l&apos;ergonomie et la qualité des contenus proposés.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">7. Google AdSense</h2>
        <p className="mt-2">
          Calqeo peut diffuser des annonces publicitaires via <strong>Google AdSense</strong>
          .
        </p>
        <p className="mt-2">
          Google peut utiliser des cookies afin de proposer des annonces adaptées aux centres
          d&apos;intérêt des utilisateurs.
        </p>
        <p className="mt-2">
          Pour en savoir plus :{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            className="text-brand-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://policies.google.com/technologies/ads
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">8. Durée de conservation</h2>
        <p className="mt-2">
          Les données sont conservées uniquement pendant la durée nécessaire à leur
          finalité.
        </p>
        <p className="mt-2">
          Les statistiques sont conservées selon les durées prévues par les outils utilisés.
        </p>
        <p className="mt-2">
          Les messages envoyés via le formulaire de contact sont conservés uniquement le
          temps nécessaire au traitement de la demande.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">
          9. Destinataires des données
        </h2>
        <p className="mt-2">Les données peuvent être traitées par :</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>l&apos;éditeur du site ;</li>
          <li>l&apos;hébergeur Vercel ;</li>
          <li>OVHcloud (gestion du nom de domaine) ;</li>
          <li>Google Analytics ;</li>
          <li>Google AdSense ;</li>
          <li>les prestataires techniques indispensables au fonctionnement du site.</li>
        </ul>
        <p className="mt-2">Aucune donnée personnelle n&apos;est vendue à des tiers.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">10. Sécurité</h2>
        <p className="mt-2">
          Toutes les mesures raisonnables sont mises en œuvre afin d&apos;assurer la sécurité
          des informations traitées.
        </p>
        <p className="mt-2">Le site utilise notamment :</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>une connexion sécurisée HTTPS ;</li>
          <li>des hébergements sécurisés ;</li>
          <li>des mises à jour régulières.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">11. Vos droits</h2>
        <p className="mt-2">
          Conformément au RGPD, vous disposez des droits suivants :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>droit d&apos;accès ;</li>
          <li>droit de rectification ;</li>
          <li>droit d&apos;effacement ;</li>
          <li>droit à la limitation du traitement ;</li>
          <li>droit d&apos;opposition ;</li>
          <li>droit à la portabilité des données.</li>
        </ul>
        <p className="mt-2">
          Vous pouvez exercer ces droits à tout moment en écrivant à :{" "}
          <a
            href="mailto:denis.antoine@live.fr"
            className="font-semibold text-brand-600 hover:underline"
          >
            denis.antoine@live.fr
          </a>
        </p>
        <p className="mt-2">
          Une réponse vous sera apportée dans les meilleurs délais et au plus tard dans un
          délai d&apos;un mois.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">12. Réclamation</h2>
        <p className="mt-2">
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une
          réclamation auprès de la Commission Nationale de l&apos;Informatique et des
          Libertés (CNIL).
        </p>
        <p className="mt-2">
          <a
            href="https://www.cnil.fr"
            className="text-brand-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.cnil.fr
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">13. Mineurs</h2>
        <p className="mt-2">Le site est destiné au grand public.</p>
        <p className="mt-2">
          Il n&apos;a pas vocation à collecter volontairement des données personnelles
          concernant des personnes âgées de moins de 15 ans.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">
          14. Modifications de la présente politique
        </h2>
        <p className="mt-2">
          La présente politique de confidentialité peut être modifiée à tout moment afin de
          tenir compte des évolutions légales, réglementaires ou techniques.
        </p>
        <p className="mt-2">
          La date de dernière mise à jour figure en haut de cette page.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">15. Contact</h2>
        <p className="mt-2">
          Pour toute question concernant la présente politique de confidentialité ou le
          traitement de vos données personnelles, vous pouvez contacter :
        </p>
        <p className="mt-2">
          <strong>Antoine Denis</strong>
          <br />
          E-mail :{" "}
          <a
            href="mailto:denis.antoine@live.fr"
            className="text-brand-600 hover:underline"
          >
            denis.antoine@live.fr
          </a>
        </p>
      </section>
    </LegalLayout>
  );
}
