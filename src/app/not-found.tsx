import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-brand-600">
        Erreur 404
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-brand-900">
        Page introuvable
      </h1>
      <p className="mt-4 max-w-md text-slate-600">
        Le simulateur que vous recherchez n&apos;existe pas ou a été déplacé.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
