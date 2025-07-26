"use client";
import DashboardTabsIcons from "@/components/svg/DashboardTabs";
import { userDashboardMenu } from "@/constants/menus";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DashboardSidebarComponent() {
  const activeTab = useSearchParams().get("tab") || "profile";
  const { setFullFilters } = useFiltersContext();

  const handleTab = (val: string) => {
    setFullFilters("tab=" + val);
  };

  return (
    <section className="md:rounded-[12px]">
      <div className="overflow-hidden rounded-[10px]">
        {/* main */}
        <div className="bg-boxBg300 pt-2">
          <nav>
            <ul>
              {userDashboardMenu?.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleTab(item.titleEn)}
                  className={`flex cursor-pointer gap-[12px] border-l-4 px-3 py-3.5 transition-colors hover:border-primary hover:bg-boxBg250 ${activeTab === item.titleEn ? "border-primary" : "border-boxBg450"}`}
                >
                  <DashboardTabsIcons
                    name={item.titleEn}
                    color="var(--TextLow)"
                  />
                  <h4>{item.title}</h4>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* footer */}
        <nav className="mt-5 bg-boxBg300 pb-2">
          <ul>
            {/* no change password functionality right now */}
            {/* <li
              className={`flex cursor-pointer gap-[12px] border-l-4 ${activeTab === "changepass" ? "border-primary" : "border-boxBg450"} px-3 py-3 transition-colors hover:border-primary`}
              onClick={() => handleTab("changepass")}
            >
              <DashboardTabsIcons name={"changepass"} color="var(--TextLow)" />
              <h4>تغییر رمز عبور</h4>
            </li> */}
            <li
              className={`flex cursor-pointer gap-[12px] border-l-4 ${activeTab === "logout" ? "border-primary" : "border-boxBg450"} px-3 py-3 transition-colors hover:border-primary`}
              onClick={() => handleTab("logout")}
            >
              <DashboardTabsIcons name={"logout"} color="var(--TextLow)" />
              <h4>خروج از حساب کاربری</h4>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default function DashboardSidebar() {
  return (
    <Suspense>
      <DashboardSidebarComponent />
    </Suspense>
  );
}
