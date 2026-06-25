import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { SimulatorGrid } from "@/components/home/SimulatorGrid";

function SimulatorGridFallback() {
  return (
    <section id="simulateurs" className="scroll-mt-24">
      <div className="text-center">
        <h2 className="section-title">Nos simulateurs</h2>
        <p className="section-subtitle mx-auto max-w-2xl">
          Chargement des simulateurs…
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="container-app py-16 sm:py-20">
        <Suspense fallback={<SimulatorGridFallback />}>
          <SimulatorGrid />
        </Suspense>

        <section className="mt-20 rounded-2xl bg-brand-900 px-8 py-12 text-center text-white sm:px-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Des outils fiables pour vos décisions du quotidien
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100">
            Immobilier, budget, impôts, travaux ou santé : nos simulateurs vous
            donnent des repères chiffrés instantanés. Vérifiez toujours auprès d&apos;un
            professionnel pour les décisions importantes.
          </p>
        </section>
      </div>
    </>
  );
}
