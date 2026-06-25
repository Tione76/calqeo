"use client";

import { useMemo, useState } from "react";
import type { CapaciteEmpruntInput } from "@/lib/simulators/capacite-emprunt";
import { capaciteEmprunt } from "@/lib/simulators/capacite-emprunt";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";
import { SimulatorFormGrid } from "@/components/simulator/SimulatorFormGrid";
import { parseNumber } from "@/lib/utils/format";
import { HCSF_TAUX_ENDETTEMENT_MAX } from "@/lib/config/aides";

const defaultValues: CapaciteEmpruntInput = {
  revenusMensuels: 3500,
  chargesMensuelles: 400,
  tauxEndettement: HCSF_TAUX_ENDETTEMENT_MAX,
  dureeAnnees: 20,
  tauxInteret: 3.5,
  apportPersonnel: 30000,
};

export function CapaciteEmpruntForm() {
  const [values, setValues] = useState(defaultValues);
  const [submitted, setSubmitted] = useState(defaultValues);

  const result = useMemo(
    () => capaciteEmprunt.calculate(submitted),
    [submitted]
  );

  const update = (field: keyof CapaciteEmpruntInput, value: number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SimulatorFormGrid
      form={
      <Card>
        <h2 className="font-display text-xl font-semibold text-brand-900">
          Vos informations
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Renseignez vos revenus, votre apport et les paramètres du crédit
          envisagé.
        </p>

        <form
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(values);
          }}
        >
          <Input
            label="Revenus mensuels nets"
            type="number"
            min={0}
            step={100}
            suffix="€"
            value={values.revenusMensuels}
            onChange={(e) =>
              update("revenusMensuels", parseNumber(e.target.value))
            }
            hint="Salaires, pensions, revenus locatifs stables…"
          />
          <Input
            label="Charges mensuelles existantes"
            type="number"
            min={0}
            step={50}
            suffix="€"
            value={values.chargesMensuelles}
            onChange={(e) =>
              update("chargesMensuelles", parseNumber(e.target.value))
            }
            hint="Crédits en cours, pensions alimentaires…"
          />
          <Input
            label="Taux d'endettement maximal"
            type="number"
            min={1}
            max={50}
            step={1}
            suffix="%"
            value={values.tauxEndettement}
            onChange={(e) =>
              update("tauxEndettement", parseNumber(e.target.value))
            }
            hint="Plafond bancaire habituel : 35 %"
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
            label="Taux d'intérêt estimé"
            type="number"
            min={0}
            max={15}
            step={0.05}
            suffix="%"
            value={values.tauxInteret}
            onChange={(e) =>
              update("tauxInteret", parseNumber(e.target.value))
            }
            hint="Taux nominal annuel hors assurance"
          />
          <Input
            label="Apport personnel"
            type="number"
            min={0}
            step={1000}
            suffix="€"
            value={values.apportPersonnel}
            onChange={(e) =>
              update("apportPersonnel", parseNumber(e.target.value))
            }
            hint="Épargne disponible pour l'achat (hors frais si vous les financez séparément)"
          />
          <Button type="submit" size="lg" className="w-full">
            Calculer ma capacité d&apos;emprunt
          </Button>
        </form>
      </Card>
      }
      results={<SimulatorResults result={result} />}
    />
  );
}
