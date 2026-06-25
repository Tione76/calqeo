import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { createLegalMetadata } from "@/lib/utils/seo";
import { LEGAL_LINKS } from "@/lib/site/config";

export const metadata: Metadata = createLegalMetadata(
  "Politique de cookies",
  "Types de cookies utilisés sur Calqeo, consentement et gestion des cookies publicitaires AdSense.",
  LEGAL_LINKS.cookies
);

export default function CookiesPage() {
  return (
    <LegalLayout title="Politique de cookies">
      <section>
        <h2 className="text-lg font-semibold text-brand-900">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
        <p className="mt-2">
          Un cookie est un petit fichier déposé sur votre terminal lors de la visite d&apos;un site.
          Il permet de mémoriser des informations ou de reconnaître votre navigateur.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">2. Cookies utilisés</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-3 font-semibold">Catégorie</th>
                <th className="p-3 font-semibold">Finalité</th>
                <th className="p-3 font-semibold">Consentement</th>
                <th className="p-3 font-semibold">Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-3">Nécessaires</td>
                <td className="p-3">Fonctionnement, mémorisation du choix cookies</td>
                <td className="p-3">Non requis</td>
                <td className="p-3">6 mois</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-3">Mesure d&apos;audience</td>
                <td className="p-3">Statistiques de fréquentation anonymisées</td>
                <td className="p-3">Requis</td>
                <td className="p-3">13 mois max.</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-3">Publicitaires (AdSense)</td>
                <td className="p-3">Affichage et mesure de publicités Google</td>
                <td className="p-3">Requis</td>
                <td className="p-3">Variable (Google)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">3. Google AdSense & CMP</h2>
        <p className="mt-2">
          Les cookies publicitaires ne sont déposés qu&apos;après votre consentement explicite via
          notre bannière. Sans consentement, seuls les emplacements publicitaires non
          personnalisés ou des blocs de démonstration peuvent s&apos;afficher selon la configuration
          AdSense. Vous pouvez retirer votre consentement à tout moment via « Gérer mes cookies »
          en pied de page.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-brand-900">4. Gérer vos choix</h2>
        <p className="mt-2">
          Utilisez le lien « Gérer mes cookies » dans le footer ou les paramètres de votre
          navigateur pour supprimer les cookies existants. Voir aussi la{" "}
          <Link href={LEGAL_LINKS.confidentialite} className="text-brand-600 hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
