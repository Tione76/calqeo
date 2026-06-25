import { createElement, type ComponentType } from "react";
import { CapaciteEmpruntForm } from "./CapaciteEmpruntForm";
import { RendementLocatifForm } from "./RendementLocatifForm";
import { MensualitePretForm } from "./MensualitePretForm";
import { GenericSimulatorForm } from "./GenericSimulatorForm";
import { getGenericFormSlugs } from "@/lib/simulators/navigation";

const genericFormSlugs = getGenericFormSlugs();

const simulatorForms: Record<string, ComponentType> = {
  "capacite-emprunt": CapaciteEmpruntForm,
  "rendement-locatif": RendementLocatifForm,
  "mensualite-pret-immobilier": MensualitePretForm,
};

export function getSimulatorForm(slug: string): ComponentType | undefined {
  if (simulatorForms[slug]) {
    return simulatorForms[slug];
  }

  if (genericFormSlugs.has(slug)) {
    return function GenericFormWrapper() {
      return createElement(GenericSimulatorForm, { slug });
    };
  }

  return undefined;
}
