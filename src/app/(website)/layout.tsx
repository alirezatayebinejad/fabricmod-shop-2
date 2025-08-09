import Footer from "@/app/(website)/_components/layout/Footer";
import Header from "@/app/(website)/_components/layout/Header";
import MobileNav from "@/app/(website)/_components/layout/MobileNav";
import Providers from "@/app/(website)/Providers";

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
        <div className="mx-auto max-w-[1600px] px-[15px] md:px-[20px]">
          {children}
        </div>
        <Footer />
      </Providers>
    </>
  );
}
