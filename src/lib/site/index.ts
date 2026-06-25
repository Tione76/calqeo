import { SITE, LEGAL } from "@/lib/site/config";

export {
  SITE as SITE_NAME_EXPORT,
  LEGAL,
};

export function getSiteUrl(): string {
  return SITE.url;
}

export function getSiteName(): string {
  return SITE.name;
}
