import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.4rem] border border-slate-200/50 border-t-[3px] border-t-[#3F6B52] bg-white p-6 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.12)]",
        hover &&
          "transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_16px_48px_-20px_rgba(15,23,42,0.14)]",
        className
      )}
    >
      {children}
    </div>
  );
}
