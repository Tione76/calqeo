import Image from "next/image";
import type { SiteDomain } from "@/lib/simulators/types";
import { getHomeCategoryIllustrationSrc } from "@/components/home/category-illustration-images";
import { cn } from "@/lib/utils/cn";

type IllustrationSize = "desktop" | "mobile";

const SIZE_CLASS: Record<IllustrationSize, string> = {
  desktop: "h-[9.8rem] w-[12.25rem] object-contain lg:h-[10.85rem] lg:w-[13.3rem]",
  mobile: "h-[4.5rem] w-[5.5rem] object-contain",
};

type Props = {
  domain: SiteDomain;
  size?: IllustrationSize;
  className?: string;
};

/** Illustration PNG de catégorie — homepage. */
export function CategoryIllustrationImage({
  domain,
  size = "desktop",
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
        sizes={size === "mobile" ? "5.5rem" : "(min-width: 1024px) 13.3rem, 12.25rem"}
        priority={domain === "immobilier"}
      />
    </div>
  );
}
