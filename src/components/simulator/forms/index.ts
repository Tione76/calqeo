import { createElement, type ComponentType } from "react";
import { CapaciteEmpruntForm } from "./CapaciteEmpruntForm";
import { RendementLocatifForm } from "./RendementLocatifForm";
import { MensualitePretForm } from "./MensualitePretForm";
import { GenericSimulatorForm } from "./GenericSimulatorForm";
import { simulators } from "@/lib/simulators";

/**
 * Mapping slug → composant formulaire.
 * Les simulateurs avec formFields utilisent GenericSimulatorForm.
 */
export const simulatorForms: Record<string, ComponentType> = {
  "capacite-emprunt": CapaciteEmpruntForm,
  "rendement-locatif": RendementLocatifForm,
  "mensualite-pret-immobilier": MensualitePretForm,
};

for (const sim of simulators) {
  if (sim.formFields && sim.defaultValues && !simulatorForms[sim.slug]) {
    const slug = sim.slug;
    simulatorForms[slug] = function SimulatorFormWrapper() {
      return createElement(GenericSimulatorForm, { slug });
    };
  }
}

export function getSimulatorForm(slug: string): ComponentType | undefined {
  return simulatorForms[slug];
}
