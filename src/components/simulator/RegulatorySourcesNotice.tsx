import { getRegulatoryNotice } from "@/data/regulations/registry";
import type { RegulationSource } from "@/data/regulations/types";

interface RegulatorySourcesNoticeProps {
  regulationIds: string[];
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function RegulatorySourcesNotice({ regulationIds }: RegulatorySourcesNoticeProps) {
  const notice = getRegulatoryNotice(regulationIds);
  if (!notice.lastUpdated || notice.sources.length === 0) return null;

  return (
    <aside
      className="rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm text-slate-700"
      aria-label="Sources officielles et date de mise à jour"
    >
      <p>
        <span className="font-semibold text-slate-900">Dernière mise à jour des données :</span>{" "}
        {formatDate(notice.lastUpdated)}
        {notice.referencePeriods.length > 0 && (
          <span className="text-slate-500"> ({notice.referencePeriods.join(", ")})</span>
        )}
      </p>
      <p className="mt-2">
        <span className="font-semibold text-slate-900">Sources officielles utilisées :</span>{" "}
        <SourceList sources={notice.sources} />
      </p>
    </aside>
  );
}

function SourceList({ sources }: { sources: RegulationSource[] }) {
  return (
    <>
      {sources.map((src, i) => (
        <span key={`${src.name}-${src.url}`}>
          {i > 0 && (i < sources.length - 1 ? ", " : " et ")}
          <a
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-900"
          >
            {src.name}
          </a>
        </span>
      ))}
    </>
  );
}
