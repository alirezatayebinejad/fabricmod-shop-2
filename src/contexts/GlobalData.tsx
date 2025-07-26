"use client";

import { Initials } from "@/types/apiTypes";
import { createContext, useContext } from "react";

export interface GlobalDataType {
  initials: Initials;
}

export const GlobalDataContext = createContext<GlobalDataType | null>(null);

export const useGlobalData = (): GlobalDataType | null => {
  const context = useContext(GlobalDataContext);
  if (!context) {
    throw new Error("useGlobalData must be used within a GlobalDataProvider");
  }
  return context;
};
