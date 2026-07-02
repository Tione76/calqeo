/** Calques décoratifs Hero — desktop uniquement, sans impact sur le rendu mobile. */
export function HeroDesktopBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-800/25 via-brand-900/10 to-brand-950/55" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 18% 22%, rgba(255,248,240,0.09) 0%, transparent 55%), radial-gradient(ellipse 55% 45% at 82% 68%, rgba(255,255,255,0.07) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(45,106,126,0.12) 0%, transparent 42%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hero-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path
              d="M36 0H0V36"
              fill="none"
              stroke="white"
              strokeWidth="0.45"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
      <div className="absolute -right-6 top-[14%] h-80 w-80 rounded-full border border-white/[0.08]" />
      <div className="absolute -right-2 top-[18%] h-64 w-64 rounded-full border border-white/[0.04]" />
      <div className="absolute left-[6%] top-[52%] h-44 w-44 rotate-[8deg] rounded-2xl border border-white/[0.07]" />
      <div className="absolute bottom-[10%] right-[20%] h-28 w-28 rounded-full bg-white/[0.04] blur-2xl" />
      <div className="absolute left-[42%] top-[8%] h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-[28%] left-[12%] h-20 w-20 rounded-full bg-accent-400/[0.06] blur-3xl" />
    </div>
  );
}
