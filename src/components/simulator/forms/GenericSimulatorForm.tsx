"use client";

import { useMemo, useState } from "react";
import { getSimulatorBySlug } from "@/lib/simulators";
import type { FormField, SimulatorResult } from "@/lib/simulators/types";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";
import { SimulatorFormGrid } from "@/components/simulator/SimulatorFormGrid";
import { parseNumber } from "@/lib/utils/format";

interface GenericSimulatorFormProps {
  slug: string;
}

export function GenericSimulatorForm({ slug }: GenericSimulatorFormProps) {
  const simulator = getSimulatorBySlug(slug);

  if (!simulator?.formFields || !simulator.defaultValues) {
    return null;
  }

  const { formFields, defaultValues, calculate, title } = simulator;

  return (
    <GenericSimulatorFormInner
      formFields={formFields}
      defaultValues={defaultValues}
      calculate={calculate as (input: Record<string, number | string>) => SimulatorResult}
      title={title}
    />
  );
}

interface InnerProps {
  formFields: FormField[];
  defaultValues: Record<string, number | string>;
  calculate: (input: Record<string, number | string>) => SimulatorResult;
  title: string;
}

function GenericSimulatorFormInner({
  formFields,
  defaultValues,
  calculate,
  title,
}: InnerProps) {
  const [values, setValues] = useState(defaultValues!);
  const [submitted, setSubmitted] = useState(defaultValues!);

  const result = useMemo(() => calculate(submitted), [calculate, submitted]);

  const update = (key: string, value: number | string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SimulatorFormGrid
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
            setSubmitted(values);
          }}
        >
          {formFields!.map((field) =>
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
