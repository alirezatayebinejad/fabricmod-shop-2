"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, Tab } from "@heroui/tabs";
import { DatabaseZap, FileText, Palette, SmartphoneNfc } from "lucide-react";
import ThemeTab from "@/app/panel/settings/_components/ThemeTab";
import ContactsTab from "@/app/panel/settings/_components/ContactsTab";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import RetryError from "@/components/datadisplay/RetryError";
import { Spinner } from "@heroui/spinner";
import SiteContentTab from "@/app/panel/settings/_components/SiteContentTab";
import { Setting } from "@/types/apiTypes";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import CachesControllTab from "@/app/panel/settings/_components/CachesControllTab";

export default function SettingTabs() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const initialTab = searchParams.get("tab") || "info";
    setSelected(initialTab);
    // eslint-disable-next-line
  }, [searchParams]);

  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/settings`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const setting: Setting = data?.data;

  if (isLoading)
    return (
      <div className="grid h-[300px] place-self-center">
        <Spinner color="primary" />
      </div>
    );
  if (error) {
    return (
      <div className="h-[250px]">
        <RetryError onRetry={() => mutate()} />
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={(key) => {
          setSelected(key as string);
          // Update the URL query parameter
          const url = new URL(window.location.href);
          url.searchParams.set("tab", key as string);
          window.history.pushState({}, "", url);
        }}
      >
        <Tab
          key="info"
          title={
            <div className="flex items-center gap-1">
              <FileText className="w-4 text-TextLow" />
              <p>مشخصات سایت</p>
            </div>
          }
        >
          <ProtectComponent
            permission="settingInfo"
            component={<SiteContentTab setting={setting} />}
          />
        </Tab>
        <Tab
          key="contact"
          title={
            <div className="flex items-center gap-1">
              <SmartphoneNfc className="w-4 text-TextLow" />
              <p>ارتباطات</p>
            </div>
          }
        >
          <ContactsTab setting={setting} />
        </Tab>
        <Tab
          key="theme"
          title={
            <div className="flex items-center gap-1">
              <Palette className="w-4 text-TextLow" />
              <p>تم سایت</p>
            </div>
          }
        >
          <ProtectComponent
            permission="settingTheme"
            component={<ThemeTab theme={setting?.theme_colors} />}
          />
        </Tab>
        <Tab
          key="cache"
          title={
            <div className="flex items-center gap-1">
              <DatabaseZap className="w-4 text-TextLow" />
              <p>حافظه پنهان</p>
            </div>
          }
        >
          <ProtectComponent
            permission="settingCache"
            component={<CachesControllTab />}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
