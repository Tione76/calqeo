import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { createLegalMetadata } from "@/lib/utils/seo";
import { LEGAL_LINKS } from "@/lib/site/config";

export const metadata: Metadata = createLegalMetadata(
  "Mentions légales",
  "Mentions légales du site Calqeo : éditeur, hébergeur, responsabilité et propriété intellectuelle.",
  LEGAL_LINKS.mentionsLegales
);

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales">
      <section>
        <h2 className="text-lg font-semibold text-brand-900">Éditeur du site</h2>
        <p className="mt-2">
          Le site <strong>Calqeo</strong> est édité par :
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
        <p className="mt-2">Le site est édité à titre personnel.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">
          Directeur de la publication
        </h2>
        <p className="mt-2">
          Le directeur de la publication est <strong>Antoine Denis</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">Hébergement</h2>
        <p className="mt-2">Le site est hébergé par :</p>
        <p className="mt-2">
          <strong>Vercel Inc.</strong>
          <br />
          440 N Barranca Avenue #4133
          <br />
          Covina, CA 91723
          <br />
          États-Unis
        </p>
        <p className="mt-2">
          Site web :{" "}
          <a
            href="https://vercel.com"
            className="text-brand-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://vercel.com
          </a>
        </p>
        <p className="mt-4">
          Le nom de domaine <strong>calqeo.fr</strong> est enregistré auprès de :
        </p>
        <p className="mt-2">
          <strong>OVHcloud</strong>
          <br />
          2 rue Kellermann
          <br />
          59100 Roubaix
          <br />
          France
        </p>
        <p className="mt-2">
          Site web :{" "}
          <a
            href="https://www.ovhcloud.com"
            className="text-brand-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.ovhcloud.com
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">
          Présentation du site
        </h2>
        <p className="mt-2">
          Calqeo est une plateforme proposant gratuitement des simulateurs et
          calculateurs destinés à aider les particuliers, salariés, indépendants
          et professionnels dans leurs décisions du quotidien.
        </p>
        <p className="mt-2">
          Les outils disponibles couvrent notamment les domaines suivants :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Immobilier</li>
          <li>Finance personnelle</li>
          <li>Fiscalité</li>
          <li>Travaux et habitat</li>
          <li>Santé</li>
          <li>Emploi et protection sociale</li>
          <li>Entreprises, freelances et indépendants</li>
          <li>Calculs du quotidien</li>
        </ul>
        <p className="mt-2">
          Les résultats fournis sont donnés à titre purement indicatif. Ils
          constituent des estimations réalisées à partir des informations saisies
          par l&apos;utilisateur et ne remplacent en aucun cas les conseils
          d&apos;un professionnel (banquier, notaire, avocat, expert-comptable,
          médecin, conseiller fiscal, etc.).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">Responsabilité</h2>
        <p className="mt-2">
          Toutes les informations et tous les calculs proposés sur Calqeo sont
          réalisés avec le plus grand soin.
        </p>
        <p className="mt-2">
          Toutefois, malgré les vérifications effectuées, aucune garantie ne
          peut être donnée quant à l&apos;exactitude, l&apos;exhaustivité ou
          l&apos;actualité permanente des informations et résultats affichés.
        </p>
        <p className="mt-2">
          L&apos;utilisateur demeure seul responsable de l&apos;utilisation
          qu&apos;il fait des simulateurs et des décisions prises à partir des
          résultats obtenus.
        </p>
        <p className="mt-2">
          L&apos;éditeur ne pourra être tenu responsable des conséquences
          directes ou indirectes résultant de l&apos;utilisation du site.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">
          Propriété intellectuelle
        </h2>
        <p className="mt-2">
          L&apos;ensemble du contenu présent sur Calqeo (textes, simulateurs,
          calculs, illustrations, graphismes, logo, design, code source,
          structure du site et éléments graphiques) est protégé par les
          dispositions du Code de la propriété intellectuelle.
        </p>
        <p className="mt-2">
          Toute reproduction, diffusion, modification ou exploitation, totale ou
          partielle, sans autorisation écrite préalable de l&apos;éditeur est
          interdite.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">
          Données personnelles
        </h2>
        <p className="mt-2">
          Calqeo veille au respect de la vie privée de ses utilisateurs.
        </p>
        <p className="mt-2">
          Les traitements de données personnelles sont réalisés conformément au
          Règlement Général sur la Protection des Données (RGPD).
        </p>
        <p className="mt-2">
          Pour plus d&apos;informations, l&apos;utilisateur est invité à
          consulter la{" "}
          <Link
            href={LEGAL_LINKS.confidentialite}
            className="text-brand-600 hover:underline"
          >
            Politique de confidentialité
          </Link>{" "}
          du site.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">Cookies</h2>
        <p className="mt-2">
          Le site utilise des cookies nécessaires à son fonctionnement ainsi que,
          sous réserve du consentement de l&apos;utilisateur, des cookies
          destinés à mesurer l&apos;audience et à diffuser des contenus
          publicitaires personnalisés.
        </p>
        <p className="mt-2">
          Les préférences relatives aux cookies peuvent être modifiées à tout
          moment via le gestionnaire de consentement affiché sur le site.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">Publicité</h2>
        <p className="mt-2">
          Calqeo peut diffuser des annonces publicitaires, notamment par
          l&apos;intermédiaire de Google AdSense ou d&apos;autres partenaires
          publicitaires.
        </p>
        <p className="mt-2">
          Ces partenaires peuvent déposer des cookies afin de personnaliser les
          annonces affichées, conformément à leur propre politique de
          confidentialité.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">Liens externes</h2>
        <p className="mt-2">
          Le site peut contenir des liens vers des sites internet tiers.
        </p>
        <p className="mt-2">
          L&apos;éditeur ne saurait être tenu responsable du contenu ou du
          fonctionnement de ces sites externes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">Disponibilité</h2>
        <p className="mt-2">
          L&apos;éditeur s&apos;efforce d&apos;assurer un accès permanent au
          site.
        </p>
        <p className="mt-2">
          Des interruptions temporaires peuvent toutefois intervenir pour des
          opérations de maintenance, des mises à jour ou en raison
          d&apos;événements indépendants de sa volonté.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">Droit applicable</h2>
        <p className="mt-2">
          Les présentes mentions légales sont régies par le droit français.
        </p>
        <p className="mt-2">
          Tout litige relatif à leur interprétation ou à leur exécution relève de
          la compétence des juridictions françaises, sous réserve des
          dispositions légales applicables.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-900">Contact</h2>
        <p className="mt-2">
          Pour toute question concernant le site ou son fonctionnement, vous
          pouvez contacter l&apos;éditeur à l&apos;adresse suivante :
        </p>
        <p className="mt-2">
          <a
            href="mailto:denis.antoine@live.fr"
            className="font-semibold text-brand-600 hover:underline"
          >
            denis.antoine@live.fr
          </a>
        </p>
      </section>
    </LegalLayout>
  );
}
