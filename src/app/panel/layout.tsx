"use client";
import Sidebar from "@/app/panel/_components/dashboard/Sidebar";
import { ChevronRight } from "lucide-react";
import { useSidebarToggle } from "@/app/panel/_contexts/SidebarToggle";
import { cn } from "@/utils/twMerge";
import BurgerMenu from "@/components/datadisplay/BurgerMenu";
import Topbar from "@/app/panel/_components/dashboard/Topbar";
import Providers from "@/app/panel/Providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isMainSidebarOpen,
    toggleMainSidebar,
    isMobileSidebarOpen,
    toggleMobileSidebar,
  } = useSidebarToggle();

  return (
    <>
      <div className="flex h-dvh overflow-hidden bg-gradient-to-tl from-primary to-secondary p-2 md:p-2.5">
        {/* if u change h or m in above div change h in dashboard navTab ScrollArea too*/}
        <div
          className={cn(
            "relative hidden min-w-[297px] max-w-[297px] rounded-[0_12px_12px_0] bg-accent-3 transition-all dark:bg-boxBg200 lg:inline-block",
            !isMainSidebarOpen ? "min-w-[20px] max-w-[20px]" : null,
          )}
        >
          <Sidebar isMainSidebarOpen={isMainSidebarOpen} />
          <div
            onClick={() => toggleMainSidebar()}
            className={`absolute left-[-16px] top-[50dvh] z-10 flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full border-[1px] border-boxBg300 bg-boxBg100 transition-colors duration-300 hover:bg-boxBg250 active:bg-boxBg300 ${!isMainSidebarOpen ? "rotate-180 bg-primary-200" : null}`}
          >
            <ChevronRight className={`w-[20px] text-TextMute`} />
          </div>
        </div>
        <BurgerMenu
          closeHandler={() => toggleMobileSidebar()}
          isVisible={isMobileSidebarOpen}
        >
          <Sidebar isMainSidebarOpen={isMainSidebarOpen} />
        </BurgerMenu>

        <div className="w-full">
          <div className="h-full overflow-hidden rounded-[12px_0_0_12px] bg-boxBg100">
            <Topbar openMobileMenu={() => toggleMobileSidebar()} />
            <Providers>{children}</Providers>
          </div>
        </div>
      </div>
    </>
  );
}
