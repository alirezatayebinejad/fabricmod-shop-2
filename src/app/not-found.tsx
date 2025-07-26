"use client";
import Footer from "@/app/(website)/_components/layout/Footer";
import Header from "@/app/(website)/_components/layout/Header";
import MobileNav from "@/app/(website)/_components/layout/MobileNav";
import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <MobileNav />
      <main>
        <div className="my-[20px] mb-10 flex flex-col items-center justify-center gap-3 px-8">
          <Image
            src="/images/404.png"
            alt="404 error"
            width={250}
            height={250}
          />
          <h1 className="mt-6 text-center text-4xl font-bold leading-relaxed">
            صفحه مورد نظر پیدا نشد!
          </h1>
          <Link prefetch={false} href="/" className="mt-5">
            <Button>رفتن به خانه</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
