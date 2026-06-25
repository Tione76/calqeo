import { financeSimulators } from "./finance";
import { fiscaliteGeneraleSimulators } from "./fiscalite-generale";
import { travauxSimulators } from "./travaux";
import { santeSimulators } from "./sante";
import { quotidienSimulators } from "./quotidien";
import { emploiSimulators } from "./emploi";
import { entrepriseSimulators } from "./entreprise";

export const generalSimulators = [
  ...financeSimulators,
  ...emploiSimulators,
  ...entrepriseSimulators,
  ...fiscaliteGeneraleSimulators,
  ...travauxSimulators,
  ...santeSimulators,
  ...quotidienSimulators,
];
