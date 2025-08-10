import Footer from "@/app/(website)/_components/layout/Footer";
import Header from "@/app/(website)/_components/layout/Header";
import MobileNav from "@/app/(website)/_components/layout/MobileNav";
import Providers from "@/app/(website)/Providers";
import { getScreenWidth } from "@/utils/getScreen";
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
        <Script
          id="goftino"
          dangerouslySetInnerHTML={{
            __html: `!function(){var i="4Hv0e4",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();${
              getScreenWidth() < 600
                ? `window.addEventListener('goftino_ready', function () {
						Goftino.setWidget({
							marginRight: 20,
							marginBottom: 70
						});
					});`
                : ""
            }`,
          }}
        ></Script>
        <div className="mx-auto max-w-[1600px] px-[15px] md:px-[20px]">
          {children}
        </div>
        <Footer />
      </Providers>
    </>
  );
}
