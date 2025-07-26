"use client";
import React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { SidebarProvider } from "@/app/panel/_contexts/SidebarToggle";
import { FiltersProvider } from "@/contexts/SearchFilters";
import { Toaster } from "react-hot-toast";
import { GlobalDataContext, GlobalDataType } from "@/contexts/GlobalData";
import BasketProvider from "@/contexts/BasketContext";
import CompareProvider from "@/contexts/compareContext";
import UserProvider from "@/contexts/UserContext";

export default function Providers({
  children,
  globalData,
}: {
  children: React.ReactNode;
  globalData: GlobalDataType;
}) {
  return (
    <>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          shouldRetryOnError: false,
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          themes={["light", "dark"]}
        >
          <Toaster
            position="top-right"
            toastOptions={{ duration: 6000 }}
            reverseOrder={false}
          />
          <GlobalDataContext.Provider value={globalData}>
            <UserProvider>
              <BasketProvider>
                <CompareProvider>
                  <FiltersProvider>
                    <SidebarProvider>
                      <HeroUIProvider>{children}</HeroUIProvider>
                    </SidebarProvider>
                  </FiltersProvider>
                </CompareProvider>
              </BasketProvider>
            </UserProvider>
          </GlobalDataContext.Provider>
        </ThemeProvider>
      </SWRConfig>
    </>
  );
}
