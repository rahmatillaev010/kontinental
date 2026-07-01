import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { MotionProvider } from "@/components/motion-provider";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Континенталь | Портал гильдии Free Fire",
  description: "Премиальный внутренний портал игровой гильдии Континенталь."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <MotionProvider />
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
