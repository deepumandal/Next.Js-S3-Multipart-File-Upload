import { getOrThrowEnv } from "@Config/env-provider";

const siteUrl = getOrThrowEnv("NEXT_PUBLIC_BASE_URL");

// splash screen
export const jsonldLayoutScreen = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "",
  alternateName: "",
  url: "https://yourwebsite.com",
  description: "",
  author: {
    "@type": "Person",
    name: "",
    url: siteUrl,
    sameAs: []
  }
};
