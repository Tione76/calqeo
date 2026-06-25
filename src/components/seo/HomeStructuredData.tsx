import { jsonLdHomePage } from "@/lib/utils/seo";

export function HomeStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdHomePage()),
      }}
    />
  );
}
