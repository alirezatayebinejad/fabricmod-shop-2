import NavTabs from "@/app/panel/_components/dashboard/NavTabs";
import SidebarFooter from "@/app/panel/_components/dashboard/SidebarFooter";
import SidebarHeader from "@/app/panel/_components/dashboard/SidebarHeader";
import { cn } from "@/utils/twMerge";

type props = {
  isMainSidebarOpen: boolean;
};

export default function Sidebar({ isMainSidebarOpen }: props) {
  return (
    <div
      className={cn(
        `flex h-full translate-x-0 flex-col transition-transform`,
        !isMainSidebarOpen ? "translate-x-[250px]" : "",
      )}
    >
      <SidebarHeader />
      <hr className="h-[2px] border-boxBg400" />
      <section className="flex-1">
        <NavTabs />
      </section>
      <hr className="h-[2px] border-boxBg200" />
      <SidebarFooter />
    </div>
  );
}
