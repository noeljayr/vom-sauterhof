import type { Metadata } from "next";
import { Suspense } from "react";
import "@/css/globals.css";
import { Navbar } from "@/components/Navbar";
import { FooterClient } from "@/components/FooterClient";

import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";
import "@fontsource/work-sans/300.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";
import "@fontsource/work-sans/800.css";
import "@fontsource/work-sans/900.css";
import Mode from "@/components/Mode";
import { AuthInitializer } from "@/components/AuthInitializer";
import clientPromise from "@/lib/mongodb";
import { NavbarContent } from "@/types/navbar";
import { FooterContent } from "@/types/footer";

export const metadata: Metadata = {
  title: "Beauceron Vom Sauterhof",
  description:
    "Wir haben eine kleine familiäre Beauceronzucht und züchten mit Leidenschaft und Herzblut  Beauceron mit FCI-Papieren. ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = await clientPromise;
  const db = client.db("vom_sauterhof");

  // Fetch navbar content
  const navbarCollection = db.collection("navbar");
  const navbarData = await navbarCollection.findOne({});
  const navbarContent: NavbarContent = navbarData
    ? {
        linkStart: navbarData.linkStart,
        linkAbout: navbarData.linkAbout,
        linkNews: navbarData.linkNews,
        linkBreed: navbarData.linkBreed,
        linkWurf: navbarData.linkWurf,
        contactButton: navbarData.contactButton,
        mobileContactHeading: navbarData.mobileContactHeading,
        mobilePhone: navbarData.mobilePhone,
        mobileEmail: navbarData.mobileEmail,
      }
    : {};

  // Fetch footer content
  const footerCollection = db.collection("footer");
  const footerData = await footerCollection.findOne({});
  const footerContent: FooterContent = footerData
    ? {
        companyName: footerData.companyName,
        address1: footerData.address1,
        address2: footerData.address2,
        phone: footerData.phone,
        email: footerData.email,
        linksHeading: footerData.linksHeading,
        linkStart: footerData.linkStart,
        linkAbout: footerData.linkAbout,
        linkNews: footerData.linkNews,
        linkBeauceron: footerData.linkBeauceron,
        linkWurf: footerData.linkWurf,
      }
    : {};

  return (
    <html lang="en">
      <body
        className={`min-h-screen antialiased bg-[#F9ECE1] overflow-x-hidden`}
      >
        <AuthInitializer />
        <Suspense fallback={null}>
          <Mode />
        </Suspense>
        <Navbar content={navbarContent} />
        {children}
        <Suspense fallback={null}>
          <FooterClient content={footerContent} />
        </Suspense>
      </body>
    </html>
  );
}
