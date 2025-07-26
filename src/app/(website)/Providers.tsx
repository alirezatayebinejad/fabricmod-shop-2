"use client";
import { HorizOrVertProvider } from "@/app/(website)/_contexts/HorizOrVert";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HorizOrVertProvider>{children}</HorizOrVertProvider>
    </>
  );
}
