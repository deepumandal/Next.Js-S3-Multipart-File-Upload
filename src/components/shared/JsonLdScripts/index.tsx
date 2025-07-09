import Script from "next/script";
import { ReactNode } from "react";

const JsonLdScripts = ({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) => (
  <Script type="application/ld+json" id={id}>
    {JSON.stringify(children)}
  </Script>
);

export default JsonLdScripts;
