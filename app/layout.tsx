import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laurie Crean - Software Developer",
  description: "Personal portfolio of Laurie Crean, a software developer based in London.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon-v2.ico" type="image/x-icon" sizes="256x256" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
