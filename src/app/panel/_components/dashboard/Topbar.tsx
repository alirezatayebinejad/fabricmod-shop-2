"use client";
import Avatar from "@/components/datadisplay/Avatar";
import { useGlobalData } from "@/contexts/GlobalData";
import { AlignJustify, DatabaseZap, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import CachesControllTab from "@/app/panel/settings/_components/CachesControllTab";
import { useUserContext } from "@/contexts/UserContext";

type props = {
  openMobileMenu: () => void;
};

export default function Topbar({ openMobileMenu }: props) {
  const globalData = useGlobalData();
  const { user } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-[70px] items-center justify-between border-b-1 border-b-boxBg400 px-5 py-3">
      <div className="flex items-center gap-[16px]">
        <div onClick={openMobileMenu} className="cursor-pointer lg:hidden">
          <AlignJustify />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Avatar
            imgSrc={
              user?.primary_image
                ? process.env.NEXT_PUBLIC_IMG_BASE + user.primary_image
                : null
            }
            width={45}
            height={45}
          />
          <p className="text-TextLow max-sm:hidden max-sm:text-TextSize300">
            {user?.name} عزیز خوش آمدید
          </p>
          <Link
            href={"/"}
            prefetch={false}
            className="flex h-5 items-center gap-1 rounded-md border-accent-1 bg-gradient-to-tl from-accent-1 to-accent-2 px-1 text-TextSize300 text-accent-1-foreground max-sm:hidden"
          >
            <SquareArrowOutUpRight className="w-3 text-accent-1-foreground" />
            مشاهده سایت
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-5 items-center gap-1 rounded-md border-1 border-accent-1 bg-gradient-to-tl from-accent-3 to-accent-4 px-1 text-TextSize300 text-TextLow max-sm:hidden"
          >
            <DatabaseZap className="w-3 text-TextLow" />
            حافظه پنهان
          </button>
        </div>
      </div>
      <Image
        src={
          globalData?.initials?.setting?.logo
            ? process.env.NEXT_PUBLIC_IMG_BASE +
              globalData.initials.setting.logo
            : "/images/imageplaceholder.png"
        }
        alt="logo"
        width={70}
        height={30}
        className="h-[30px]"
      />
      <ModalWrapper
        modalBody={<CachesControllTab />}
        isDismissable={true}
        disclosures={{
          isOpen: isModalOpen,
          onOpenChange: () => setIsModalOpen(false),
        }}
      />
    </div>
  );
}
