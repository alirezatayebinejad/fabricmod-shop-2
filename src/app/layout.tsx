import type { Metadata } from "next";
import "@/styles/globals.css";
import localFont from "next/font/local";
import Providers from "@/app/Providers";
import apiCRUD from "@/services/apiCRUD";
import { generateTheme } from "@/styles/theme";
import { serverCache } from "@/constants/cacheNames";
import { Initials, Theme } from "@/types/apiTypes";

const dana = localFont({
  src: [
    { path: "../styles/fonts/DanaVF.woff2" },
    { path: "../styles/fonts/DanaVF.woff" },
  ],
  display: "swap",
  variable: "--font-dana",
});

export const metadata: Metadata = {
  //is setted in the page component
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialsRes = (await apiCRUD({
    urlSuffix: "next/initials",
    requiresToken: false,
    ...serverCache.initials,
  })) as Initials;
  const themeRes = await apiCRUD({
    urlSuffix: "next/themes",
    requiresToken: false,
    ...serverCache.theme,
  });
  console.log("initialsRes", initialsRes);

  metadata.title = initialsRes?.setting?.title;
  metadata.description = initialsRes?.setting?.description;

  return (
    <html
      lang="fa"
      dir="rtl"
      className={`bg-bodyBg text-inherit`}
      suppressHydrationWarning
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: generateTheme(themeRes?.data as Theme),
          }}
        />
        <meta name="enamad" content="745786" />
        <meta
          name="google-site-verification"
          content="aqNZcNkIqHD-T7WMhkcbhPw9weFTuSU-0R49a-2E1G8"
        />
      </head>
      <body className={`${dana.variable} font-dana`}>
        <Providers
          globalData={{
            initials: initialsRes,
          }}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
