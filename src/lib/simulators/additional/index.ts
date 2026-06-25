import { fiscaliteSimulatorsPart2 } from "./fiscalite-2";

import { financementSimulatorsPart3 } from "./financement-3";

import { investissementSimulatorsPart2 } from "./investissement-2";

import { gestionSimulatorsPart2 } from "./gestion-2";

import { financementSimulatorsPart1 } from "./financement-1";

import { financementSimulatorsPart2 } from "./financement-2";

import { investissementSimulators } from "./investissement";

import { gestionSimulators } from "./gestion";



export const additionalSimulators = [

  ...financementSimulatorsPart1,

  ...financementSimulatorsPart2,

  ...financementSimulatorsPart3,

  ...investissementSimulators,

  ...investissementSimulatorsPart2,

  ...fiscaliteSimulatorsPart2,

  ...gestionSimulators,

  ...gestionSimulatorsPart2,

];

