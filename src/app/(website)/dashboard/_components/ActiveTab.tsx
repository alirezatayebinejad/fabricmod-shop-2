"use client";
import AddressTab from "@/app/(website)/dashboard/_components/Tabs/AddressTab";
import ChangePassTab from "@/app/(website)/dashboard/_components/Tabs/ChangePassTab";
import FavouritesTab from "@/app/(website)/dashboard/_components/Tabs/FavouritesTab";
import LogoutTab from "@/app/(website)/dashboard/_components/Tabs/LogoutTab";
import OrdersTab from "@/app/(website)/dashboard/_components/Tabs/OrdersTab";
import PaymentsTab from "@/app/(website)/dashboard/_components/Tabs/PaymentsTab";
import ProfileTab from "@/app/(website)/dashboard/_components/Tabs/ProfileTab";
import DashboardTabsIcons from "@/components/svg/DashboardTabs";
import { userDashboardMenu } from "@/constants/menus";
import { usePathname, useSearchParams } from "next/navigation";

export default function ActiveTab() {
  const activeTab = useSearchParams().get("tab") || "profile";
  const pathname = usePathname();

  const handleSearch = (val: string) => {
    const newUrl = `${pathname}${"?" + "tab=" + val}`;
    window.history.replaceState({}, "", newUrl);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "favourites":
        return <FavouritesTab />;
      case "payments":
        return <PaymentsTab />;
      case "address":
        return <AddressTab />;
      case "orders":
        return <OrdersTab />;
      case "logout":
        return <LogoutTab />;
      case "changepass":
        return <ChangePassTab />;

      default:
        break;
    }
  };

  return (
    <div>
      {/* mobile menue instead of sidebar */}
      <div className="m-[0_auto] mb-5 mt-5 max-w-[93vw] overflow-x-auto rounded-[10px] bg-boxBg400 scrollbar-hide md:hidden">
        <ul className="flex">
          {userDashboardMenu?.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSearch(item.titleEn)}
              className={`flex cursor-pointer items-center gap-[5px] px-4 py-3 transition-colors hover:border-primary ${activeTab === item.titleEn ? "border-b-3 border-b-primary" : ""}`}
            >
              <DashboardTabsIcons
                name={item.titleEn}
                color="var(--TextLow)"
                width={15}
              />
              <h4 className="text-nowrap text-TextSize300">{item.title}</h4>
            </li>
          ))}
        </ul>
      </div>
      {/* tabs content */}
      {renderActiveTab()}
    </div>
  );
}
