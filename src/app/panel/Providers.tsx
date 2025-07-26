"use client";
import React from "react";
import { SidebarProvider } from "@/app/panel/_contexts/SidebarToggle";
import { TableMutateProvider } from "@/app/panel/_contexts/tableMutateContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <TableMutateProvider>{children}</TableMutateProvider>
      </SidebarProvider>
    </>
  );
}
