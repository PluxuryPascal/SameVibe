import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "src/styles/globals.css";
import BackgroundAnimation from "src/components/BackgroundAnimation";
import Providers from "src/components/Provider";
import "bootstrap/dist/css/bootstrap.min.css";

import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SameVibe",
  description: "test",
};

export const generateStaticParams = () => {
  return ["en", "ru", "es", "de"].map((locale) => ({ locale }));
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={"en"}>
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <BackgroundAnimation />
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </body>
      </Providers>
    </html>
  );
}
