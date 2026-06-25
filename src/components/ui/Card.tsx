import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card ${
        hover
          ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
