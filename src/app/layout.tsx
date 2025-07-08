import type { Metadata } from "next";
import { ReactNode } from "react";
import "@GlobalCss";
import { getOrThrowEnv } from "@Config/env-provider";
import { ThemeProvider } from "@HOC/theme";
import { SEO } from "@Static/SEO";

export const metadata: Metadata = {
  ...SEO
};

const isProduction = process.env.NODE_ENV === "production";

/* eslint-disable react/display-name */
export default ({
  children
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1.0, shrink-to-fit=no"
      />
      {isProduction && (
        <meta name="google-site-verification" content={getOrThrowEnv("GOOGLE_SITE_VERIFICATION")} />
      )}
    </head>
    <body className="no-scrollbar" suppressHydrationWarning>
      {/* <SessionProvider> */}
      {/* <ToastProvider> */}
      <ThemeProvider>{children}</ThemeProvider>
      {/* </ToastProvider> */}
      {/* </SessionProvider> */}
    </body>
  </html>
);
