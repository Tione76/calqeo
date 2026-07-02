import Image from "next/image";
import type { SiteDomain } from "@/lib/simulators/types";
import { getHomeCategoryIllustrationSrc } from "@/components/home/category-illustration-images";
import { cn } from "@/lib/utils/cn";

type Size = "header" | "card" | "mobile-header";

const SIZE_CLASS: Record<Size, string> = {
  header: "h-24 w-28 object-contain sm:h-28 sm:w-32",
  card: "h-14 w-16 object-contain",
  "mobile-header": "h-11 w-12 object-contain",
};

const SIZE_HINT: Record<Size, string> = {
  header: "8rem",
  card: "4rem",
  "mobile-header": "3rem",
};

type Props = {
  domain: SiteDomain;
  size?: Size;
  className?: string;
};

/** Illustration PNG catégorie — pages simulateur (variantes de taille). */
export function SimulatorCategoryIllustration({
  domain,
  size = "header",
  className = "",
}: Props) {
  return (
    <div className={cn("relative shrink-0", className)} aria-hidden>
      <Image
        src={getHomeCategoryIllustrationSrc(domain)}
        alt=""
        width={1254}
        height={1254}
        className={SIZE_CLASS[size]}
        sizes={SIZE_HINT[size]}
      />
    </div>
  );
}
