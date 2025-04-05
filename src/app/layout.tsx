import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "src/styles/globals.css";
import BackgroundAnimation from "src/components/BackgroundAnimation";
import Providers from "src/components/Provider";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
