"use client";
import Socials from "@/app/(website)/_components/snippets/Socials";
import { footerEasyaccess, footerInfo } from "@/constants/menus";
import { useGlobalData } from "@/contexts/GlobalData";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import WhatsappIcon from "@/components/svg/whatsapp";

export default function Footer() {
  const globalData = useGlobalData();
  const [src, setSrc] = useState(
    "https://trustseal.enamad.ir/logo.aspx?id=450502&Code=FEnDmHn6FWgGAWnrX9e88O0T3GlkeVwo",
  );
  // Find the whatsapp social link if it exists
  const whatsappSocial = globalData?.initials?.setting?.socials?.find?.(
    (social) => social.name?.toLowerCase() === "whatsapp",
  );

  return (
    <>
      <footer className="mt-28 bg-boxBg100 dark">
        <div className="grid grid-cols-4 gap-2 p-16 max-md:grid-cols-2 max-md:gap-10 max-sm:grid-cols-1 [&>h4]:font-bold">
          <div className="md:mx-auto">
            <h4 className="mb-4 text-TextSize600 font-bold">
              فروشگاه {globalData?.initials?.setting?.title}
            </h4>
            <p className="mb-3">{globalData?.initials?.setting?.description}</p>
            <Socials data={globalData?.initials?.setting?.socials} />
            <div className="mt-3">
              <p className="pb-2">برای ارتباط با ما تماس بگیرید:</p>
              <div>
                {globalData?.initials?.setting?.telephones?.map((t) => (
                  <div key={t.name} className="flex gap-1">
                    <p>{t.name}:</p>
                    {t.value && <p>{t.value}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:mx-auto">
            <h4 className="mb-4 text-TextSize600 font-bold">دسترسی سریع</h4>
            <ul className="flex flex-col gap-3">
              {footerEasyaccess?.map((i) => (
                <Link prefetch={false} href={i.link} key={i.id}>
                  <li className="text-TextColor transition-colors hover:text-primary">
                    {i.name}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div className="md:mx-auto">
            <h4 className="mb-4 text-TextSize600 font-bold">اطلاعات</h4>
            <ul className="flex flex-col gap-3">
              {footerInfo?.map((i) => (
                <Link prefetch={false} href={i.link} key={i.id}>
                  <li className="text-TextColor transition-colors hover:text-primary">
                    {i.name}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div className="mx-auto flex flex-col gap-4">
            <Image
              src={
                globalData?.initials?.setting?.logo
                  ? process.env.NEXT_PUBLIC_IMG_BASE +
                    globalData.initials.setting.logo
                  : "/images/imageplaceholder.png"
              }
              alt="logo"
              width={120}
              height={120}
              className="mb-5 h-auto w-[120px]"
            />
            <a
              target="_blank"
              href="https://trustseal.enamad.ir/?id=450502&Code=FEnDmHn6FWgGAWnrX9e88O0T3GlkeVwo"
            >
              <div
                style={{
                  minWidth: "100px",
                  height: "100%",
                }}
              >
                <Image
                  referrerPolicy="origin"
                  src={src}
                  onError={() => {
                    setSrc("/enamad.png");
                  }}
                  alt="نشان اینماد"
                  style={{ cursor: "pointer" }}
                  id="FEnDmHn6FWgGAWnrX9e88O0T3GlkeVwo"
                  width={70}
                  height={70}
                />
              </div>
            </a>
          </div>
        </div>
        <div className="border-t-1 border-t-boxBg400 px-16 py-5 text-center">
          <p>
            © تمامی حقوق برای وبسایت {globalData?.initials?.setting?.title}{" "}
            محقوظ است
          </p>
        </div>
      </footer>
      {/* Whatsapp Floating Button */}
      {whatsappSocial && whatsappSocial.value && (
        <a
          href={whatsappSocial.value}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-[30px] left-5 z-[1000] flex items-center justify-center rounded-full bg-white/15 p-[5px] shadow-lg max-md:bottom-[70px]"
          aria-label="Whatsapp"
        >
          <WhatsappIcon width={55} height={55} fill="#25D366" />
        </a>
      )}
    </>
  );
}
