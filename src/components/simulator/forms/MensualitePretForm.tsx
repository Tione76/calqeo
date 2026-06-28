"use client";

import { useState } from "react";
import type { MensualitePretInput } from "@/lib/simulators/mensualite-pret";
import { mensualitePret } from "@/lib/simulators/mensualite-pret";
import { useEnrichedSimulatorResult } from "@/components/simulator/useEnrichedSimulatorResult";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";
import { SimulatorFormGrid } from "@/components/simulator/SimulatorFormGrid";
import { parseNumber } from "@/lib/utils/format";

const defaultValues: MensualitePretInput = {
  montantEmprunt: 250000,
  tauxInteret: 3.5,
  dureeAnnees: 20,
  tauxAssurance: 0.3,
};

export function MensualitePretForm() {
  const [values, setValues] = useState(defaultValues);
  const [submitted, setSubmitted] = useState(defaultValues);

  const result = useEnrichedSimulatorResult(
    "mensualite-pret-immobilier",
    submitted,
    (input) => mensualitePret.calculate(input)
  );

  const update = (field: keyof MensualitePretInput, value: number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SimulatorFormGrid
      isResultReady={!!result}
      form={
      <Card>
        <h2 className="font-display text-xl font-semibold text-brand-900">
          Paramètres du prêt
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Indiquez le montant, la durée et le taux de votre crédit immobilier.
        </p>

        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted({ ...values });
          }}
        >
          <Input
            label="Montant emprunté"
            type="number"
            min={0}
            step={1000}
            suffix="€"
            value={values.montantEmprunt}
            onChange={(e) =>
              update("montantEmprunt", parseNumber(e.target.value))
            }
          />
          <Input
            label="Taux d'intérêt"
            type="number"
            min={0}
            max={15}
            step={0.05}
            suffix="%"
            value={values.tauxInteret}
            onChange={(e) =>
              update("tauxInteret", parseNumber(e.target.value))
            }
            hint="Taux nominal annuel"
          />
          <Select
            label="Durée du prêt"
            value={values.dureeAnnees}
            onChange={(e) =>
              update("dureeAnnees", parseNumber(e.target.value))
            }
            options={[
              { value: 10, label: "10 ans" },
              { value: 15, label: "15 ans" },
              { value: 20, label: "20 ans" },
              { value: 25, label: "25 ans" },
              { value: 30, label: "30 ans" },
            ]}
          />
          <Input
            label="Taux d'assurance emprunteur"
            type="number"
            min={0}
            max={2}
            step={0.01}
            suffix="%"
            value={values.tauxAssurance}
            onChange={(e) =>
              update("tauxAssurance", parseNumber(e.target.value))
            }
            hint="Taux annuel sur le capital (optionnel)"
          />
          <Button type="submit" size="lg" className="w-full">
            Calculer la mensualité
          </Button>
        </form>
      </Card>
      }
      results={<SimulatorResults result={result} />}
    />
  );
}
