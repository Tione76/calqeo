import { Suspense } from "react";

import { MainNav } from "./MainNav";
import { HeaderLogo } from "./HeaderLogo";
import { SimulatorSearch } from "./SimulatorSearch";

export function Header() {
  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md"
    >
      <div className="container-app">
        <div className="flex h-16 items-center gap-3 sm:gap-4">
          <HeaderLogo />

          <div className="hidden min-w-0 flex-1 md:block md:max-w-md lg:max-w-lg">
            <Suspense
              fallback={
                <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
              }
            >
              <SimulatorSearch
                variant="compact"
                placeholder="Rechercher un outil…"
              />
            </Suspense>
          </div>

          <div className="ml-auto shrink-0">
            <MainNav />
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <Suspense
            fallback={
              <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
            }
          >
            <SimulatorSearch
              variant="compact"
              placeholder="Rechercher un simulateur…"
            />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
