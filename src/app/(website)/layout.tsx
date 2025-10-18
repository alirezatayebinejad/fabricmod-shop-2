import Footer from "@/app/(website)/_components/layout/Footer";
import Header from "@/app/(website)/_components/layout/Header";
import MobileNav from "@/app/(website)/_components/layout/MobileNav";
import Providers from "@/app/(website)/Providers";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Providers>
        <Header />
        <MobileNav />
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-T0YGRWV48V"
        ></Script>
        <Script id="google-analytics">
          {` window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-T0YGRWV48V');`}
        </Script>

        <div className="mx-auto max-w-[1600px] px-[15px] md:px-[20px]">
          {children}
        </div>
        <Footer />
      </Providers>
    </>
  );
}
