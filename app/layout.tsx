import type { Metadata } from "next";
import "./globals.css";
import { AccountAccess } from "@/components/account-access";
import { Footer } from "@/components/footer";
import { MotionProvider } from "@/components/motion-provider";
import { Navigation } from "@/components/navigation";
import { PageFlowGate } from "@/components/page-flow-gate";
import { RouteTransition } from "@/components/route-transition";
import { createPageMetadata, defaultSeo } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(defaultSeo.siteUrl),
  ...createPageMetadata({
    title: "Континенталь",
    description: "Закрытый портал элитной гильдии Free Fire.",
    path: "/"
  }),
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Континенталь",
    url: defaultSeo.siteUrl,
    logo: `${defaultSeo.siteUrl}/icon.svg`,
    description: defaultSeo.description,
    sameAs: ["https://t.me/glkontinental"]
  };

  return (
    <html lang="ru">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <MotionProvider />
        <Navigation />
        <RouteTransition />
        {children}
        <PageFlowGate />
        <Footer />
        <AccountAccess />
      </body>
    </html>
  );
}
