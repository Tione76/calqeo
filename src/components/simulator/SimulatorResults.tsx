import type { SimulatorResult } from "@/lib/simulators/types";

import Link from "next/link";

import { Card } from "@/components/ui/Card";

import { ResultInterpretationBlock } from "./results/ResultInterpretationBlock";



interface SimulatorResultsProps {
  result: SimulatorResult | null;
  emptyMessage?: string;
}



const calloutStyles = {

  info: "border-brand-200 bg-brand-50/60",

  tip: "border-emerald-200 bg-emerald-50/50",

  warning: "border-amber-200 bg-amber-50/60",

  note: "border-slate-200 bg-slate-50",

} as const;



export function SimulatorResults({
  result,
  emptyMessage = "Remplissez le formulaire pour voir les résultats.",
}: SimulatorResultsProps) {
  if (!result) {
    return (
      <Card className="flex min-h-[320px] items-center justify-center">

        <p className="text-center text-slate-500">{emptyMessage}</p>

      </Card>

    );

  }



  const primary = result.primary;

  const narrative = result.narrative;



  return (
    <Card className="overflow-hidden p-0">
      {/* 1. Résultat principal */}
      {primary && (
        <div className="border-b border-[#B8D4C0]/60 bg-gradient-to-br from-[#F6FAF7] to-white px-5 py-6 sm:px-6">
          <p className="text-sm font-medium text-[#3F6B52]">{primary.label}</p>

          <p className="mt-1 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">

            {primary.value}

          </p>

        </div>

      )}



      <div className="space-y-5 p-5 sm:p-6">

        {/* 2. Résumé contextualisé */}

        {narrative && (

          <p className="text-sm leading-relaxed text-slate-600">{narrative}</p>

        )}



        {/* 3. Interprétation */}

        {result.interpretation && (

          <ResultInterpretationBlock {...result.interpretation} />

        )}



        {/* 4. Conseils */}

        {result.advice && result.advice.items.length > 0 && (

          <div className="rounded-xl border border-slate-100 bg-white p-4">

            <p className="text-sm font-semibold text-brand-900">

              {result.advice.title}

            </p>

            <ul className="mt-3 space-y-2">

              {result.advice.items.map((item) => (

                <li

                  key={item}

                  className="flex gap-2 text-sm text-slate-600 before:shrink-0 before:font-bold before:text-brand-500 before:content-['•']"

                >

                  {item}

                </li>

              ))}

            </ul>

          </div>

        )}



        {/* 5. Comparaisons */}

        {result.comparisons && result.comparisons.length > 0 && (

          <div className="space-y-3">

            <p className="text-sm font-semibold text-slate-800">

              Comparaisons

            </p>

            <div className="grid gap-3 sm:grid-cols-2">

              {result.comparisons.map((c) => (

                <div

                  key={c.scenario}

                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"

                >

                  <p className="text-xs font-medium text-slate-500">

                    {c.scenario}

                  </p>

                  <p className="mt-1 text-lg font-bold text-brand-800">

                    {c.value}

                  </p>

                  {c.detail && (

                    <p className="mt-0.5 text-xs text-slate-500">{c.detail}</p>

                  )}

                </div>

              ))}

            </div>

          </div>

        )}



        {/* 6. Encadrés pédagogiques */}

        {result.callouts?.map((c) => (

          <div

            key={`${c.variant}-${c.title}`}

            className={`rounded-xl border p-4 ${calloutStyles[c.variant]}`}

          >

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">

              {c.title}

            </p>

            <p className="mt-1 text-sm leading-relaxed text-slate-700">

              {c.text}

            </p>

            {c.link && (

              <p className="mt-2">

                <Link

                  href={c.link.href}

                  className="text-sm font-medium text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-900"

                >

                  {c.link.label}

                </Link>

              </p>

            )}

          </div>

        ))}



        {/* 7. Détails secondaires */}

        {result.lines.length > 0 && (

          <div>

            <p className="mb-3 text-sm font-semibold text-slate-800">Détails</p>

            <dl className="divide-y divide-slate-100 rounded-xl border border-slate-100">

              {result.lines.map((line) => (

                <div

                  key={line.label}

                  className="flex items-start justify-between gap-4 px-4 py-3"

                >

                  <dt className="min-w-0 flex-1">

                    <span className="text-sm text-slate-600">{line.label}</span>

                    {line.description && (

                      <p className="mt-0.5 text-xs text-slate-400">

                        {line.description}

                      </p>

                    )}

                  </dt>

                  <dd className="shrink-0 text-right text-sm font-semibold text-slate-900">

                    {line.value}

                  </dd>

                </div>

              ))}

            </dl>

          </div>

        )}



        {/* Tableau amortissement / données tabulaires */}

        {result.table && (

          <div className="overflow-x-auto">

            {result.table.caption && (

              <p className="mb-3 text-sm font-medium text-slate-700">

                {result.table.caption}

              </p>

            )}

            <table className="w-full min-w-[480px] text-left text-sm">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50">

                  {result.table.headers.map((header) => (

                    <th

                      key={header}

                      className="px-3 py-2 font-semibold text-slate-700"

                    >

                      {header}

                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {result.table.rows.map((row, i) => (

                  <tr key={i} className="border-b border-slate-100">

                    {row.map((cell, j) => (

                      <td key={j} className="px-3 py-2 text-slate-600">

                        {cell}

                      </td>

                    ))}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </Card>

  );

}


