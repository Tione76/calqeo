"use client";

import { useEffect, useState } from "react";
import type { FormField, SimulatorResult } from "@/lib/simulators/types";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";
import { SimulatorFormGrid } from "@/components/simulator/SimulatorFormGrid";
import { useEnrichedSimulatorResult } from "@/components/simulator/useEnrichedSimulatorResult";
import { parseNumber } from "@/lib/utils/format";

interface GenericSimulatorFormProps {
  slug: string;
}

type GenericSimulatorConfig = {
  formFields: FormField[];
  defaultValues: Record<string, number | string>;
  calculate: (input: Record<string, number | string>) => SimulatorResult;
  title: string;
};

export function GenericSimulatorForm({ slug }: GenericSimulatorFormProps) {
  const [simulator, setSimulator] = useState<GenericSimulatorConfig | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("@/lib/simulators").then(({ getSimulatorBySlug }) => {
      if (cancelled) return;
      const found = getSimulatorBySlug(slug);
      if (found?.formFields && found.defaultValues) {
        setSimulator({
          formFields: found.formFields,
          defaultValues: found.defaultValues,
          calculate: found.calculate as (
            input: Record<string, number | string>
          ) => SimulatorResult,
          title: found.title,
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!simulator) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-10 w-full rounded bg-slate-100" />
          <div className="h-10 w-full rounded bg-slate-100" />
          <div className="h-12 w-full rounded bg-slate-100" />
        </div>
      </Card>
    );
  }

  return (
    <GenericSimulatorFormInner
      slug={slug}
      formFields={simulator.formFields}
      defaultValues={simulator.defaultValues}
      calculate={
        simulator.calculate as (
          input: Record<string, number | string>
        ) => SimulatorResult
      }
      title={simulator.title}
    />
  );
}

interface InnerProps {
  slug: string;
  formFields: FormField[];
  defaultValues: Record<string, number | string>;
  calculate: (input: Record<string, number | string>) => SimulatorResult;
  title: string;
}

function GenericSimulatorFormInner({
  slug,
  formFields,
  defaultValues,
  calculate,
  title,
}: InnerProps) {
  const [values, setValues] = useState(defaultValues);
  const [submitted, setSubmitted] = useState(defaultValues);
  const result = useEnrichedSimulatorResult(slug, submitted, calculate);

  const update = (key: string, value: number | string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SimulatorFormGrid
      isResultReady={!!result}
      form={
        <Card>
          <h2 className="font-display text-xl font-semibold text-brand-900">
            Vos informations
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Renseignez les champs ci-dessous pour simuler : {title.toLowerCase()}.
          </p>

          <form
            className="mt-6 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted({ ...values });
            }}
          >
            {formFields.map((field) =>
              field.type === "select" ? (
                <Select
                  key={field.key}
                  label={field.label}
                  hint={field.hint}
                  value={String(values[field.key] ?? "")}
                  onChange={(e) => update(field.key, e.target.value)}
                  options={
                    field.options?.map((o) => ({
                      value: o.value,
                      label: o.label,
                    })) ?? []
                  }
                />
              ) : (
                <Input
                  key={field.key}
                  label={field.label}
                  type="number"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  suffix={field.suffix}
                  hint={field.hint}
                  value={Number(values[field.key]) || 0}
                  onChange={(e) =>
                    update(field.key, parseNumber(e.target.value))
                  }
                />
              )
            )}
            <Button type="submit" size="lg" className="w-full">
              Lancer la simulation
            </Button>
          </form>
        </Card>
      }
      results={<SimulatorResults result={result} />}
    />
  );
}
