"use client";

import { useState } from "react";
import type { RendementLocatifInput } from "@/lib/simulators/rendement-locatif";
import { rendementLocatif } from "@/lib/simulators/rendement-locatif";
import { useEnrichedSimulatorResult } from "@/components/simulator/useEnrichedSimulatorResult";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";
import { SimulatorFormGrid } from "@/components/simulator/SimulatorFormGrid";
import { parseNumber } from "@/lib/utils/format";

const defaultValues: RendementLocatifInput = {
  prixAchat: 180000,
  fraisNotaire: 14400,
  travaux: 10000,
  loyerMensuel: 850,
  chargesAnnuelles: 2400,
  vacanceLocative: 5,
};

export function RendementLocatifForm() {
  const [values, setValues] = useState(defaultValues);
  const [submitted, setSubmitted] = useState(defaultValues);

  const result = useEnrichedSimulatorResult(
    "rendement-locatif",
    submitted,
    (input) => rendementLocatif.calculate(input)
  );

  const update = (field: keyof RendementLocatifInput, value: number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SimulatorFormGrid
      form={
      <Card>
        <h2 className="font-display text-xl font-semibold text-brand-900">
          Votre investissement
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Détaillez l&apos;acquisition et les revenus locatifs prévus.
        </p>

        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(values);
          }}
        >
          <Input
            label="Prix d'achat"
            type="number"
            min={0}
            step={1000}
            suffix="€"
            value={values.prixAchat}
            onChange={(e) => update("prixAchat", parseNumber(e.target.value))}
          />
          <Input
            label="Frais de notaire"
            type="number"
            min={0}
            step={100}
            suffix="€"
            value={values.fraisNotaire}
            onChange={(e) =>
              update("fraisNotaire", parseNumber(e.target.value))
            }
            hint="Environ 7 à 8 % dans l'ancien"
          />
          <Input
            label="Travaux et rénovation"
            type="number"
            min={0}
            step={500}
            suffix="€"
            value={values.travaux}
            onChange={(e) => update("travaux", parseNumber(e.target.value))}
          />
          <Input
            label="Loyer mensuel hors charges"
            type="number"
            min={0}
            step={50}
            suffix="€"
            value={values.loyerMensuel}
            onChange={(e) =>
              update("loyerMensuel", parseNumber(e.target.value))
            }
          />
          <Input
            label="Charges annuelles"
            type="number"
            min={0}
            step={100}
            suffix="€"
            value={values.chargesAnnuelles}
            onChange={(e) =>
              update("chargesAnnuelles", parseNumber(e.target.value))
            }
            hint="Taxe foncière, copropriété, assurance PNO, gestion…"
          />
          <Input
            label="Vacance locative"
            type="number"
            min={0}
            max={50}
            step={1}
            suffix="%"
            value={values.vacanceLocative}
            onChange={(e) =>
              update("vacanceLocative", parseNumber(e.target.value))
            }
            hint="Part du loyer perdue (périodes inoccupées)"
          />
          <Button type="submit" size="lg" className="w-full">
            Calculer le rendement locatif
          </Button>
        </form>
      </Card>
      }
      results={<SimulatorResults result={result} />}
    />
  );
}
