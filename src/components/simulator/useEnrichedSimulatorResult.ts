"use client";

import { useMemo } from "react";
import type { SimulatorResult } from "@/lib/simulators/types";
import { enrichSimulatorResult } from "@/lib/simulators/_shared/results";

export function useEnrichedSimulatorResult<T>(
  slug: string,
  submitted: T,
  calculate: (input: T) => SimulatorResult
): SimulatorResult {
  return useMemo(() => {
    const raw = calculate(submitted);
    return enrichSimulatorResult(
      slug,
      submitted as Record<string, number | string>,
      raw
    );
  }, [slug, calculate, submitted]);
}
