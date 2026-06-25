import type { SimulatorResult } from "@/lib/simulators/types";
import { Card } from "@/components/ui/Card";

interface SimulatorResultsProps {
  result: SimulatorResult | null;
  emptyMessage?: string;
}

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

  return (
    <Card>
      <div className="mb-6 rounded-xl bg-brand-50 p-4">
        <p className="text-sm font-medium text-brand-700">Résultat</p>
        <p className="mt-1 text-lg font-semibold text-brand-900">
          {result.summary}
        </p>
      </div>

      <dl className="space-y-4">
        {result.lines.map((line) => (
          <div
            key={line.label}
            className={`flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0 ${
              line.highlight ? "rounded-lg bg-slate-50 px-3 py-3" : ""
            }`}
          >
            <dt className="flex-1">
              <span
                className={`text-sm ${
                  line.highlight
                    ? "font-semibold text-brand-900"
                    : "text-slate-600"
                }`}
              >
                {line.label}
              </span>
              {line.description && (
                <p className="mt-0.5 text-xs text-slate-400">
                  {line.description}
                </p>
              )}
            </dt>
            <dd
              className={`text-right text-sm ${
                line.highlight
                  ? "font-bold text-brand-700"
                  : "font-medium text-slate-900"
              }`}
            >
              {line.value}
            </dd>
          </div>
        ))}
      </dl>

      {result.table && (
        <div className="mt-8 overflow-x-auto">
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
                  {row.map((cell) => (
                    <td key={cell} className="px-3 py-2 text-slate-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
