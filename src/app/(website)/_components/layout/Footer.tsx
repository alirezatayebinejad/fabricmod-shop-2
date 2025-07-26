"use client";
import Socials from "@/app/(website)/_components/snippets/Socials";
import { footerEasyaccess, footerInfo } from "@/constants/menus";
import { useGlobalData } from "@/contexts/GlobalData";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const globalData = useGlobalData();
  return (
    <footer className="mt-28 bg-boxBg100 dark">
      <div className="grid grid-cols-4 gap-2 p-16 max-md:grid-cols-2 max-md:gap-10 max-sm:grid-cols-1 [&>h4]:font-bold">
        <div className="md:mx-auto">
          <h4 className="mb-4 text-TextSize600 font-bold">
            فروشگاه {globalData?.initials?.setting?.title}
          </h4>
          <p className="mb-3">{globalData?.initials?.setting?.description}</p>
          <Socials data={globalData?.initials?.setting?.socials} />
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
            width={150}
            height={80}
            className="mb-5 h-auto w-full"
          />
          <p>برای ارتباط با ما تماس بگیرید:</p>
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
      <div className="border-t-1 border-t-boxBg400 px-16 py-5 text-center">
        <p>
          © تمامی حقوق برای وبسایت {globalData?.initials?.setting?.title} محقوظ
          است
        </p>
      </div>
    </footer>
  );
}
