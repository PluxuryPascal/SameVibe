import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "src/styles/globals.css";
import BackgroundAnimation from "src/components/BackgroundAnimation";
import Providers from "src/components/Provider";
import "bootstrap/dist/css/bootstrap.min.css";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={"ru"}>
      <Providers>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <BackgroundAnimation />
          {children}
        </body>
      </Providers>
    </html>
  );
}
