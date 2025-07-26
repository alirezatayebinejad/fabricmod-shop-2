"use client";
import { createContext, useContext, useState } from "react";

interface SidebarContextState {
  isMobileSidebarOpen: boolean;
  isMainSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  toggleMainSidebar: () => void;
  closeMobileSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextState | undefined>(
  undefined,
);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(true);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prevState) => !prevState);
  };

  const toggleMainSidebar = () => {
    setIsMainSidebarOpen((prevState) => !prevState);
  };
  const closeMobileSidebar = () => {
    if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
  };

  const value: SidebarContextState = {
    isMobileSidebarOpen,
    isMainSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
    toggleMainSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebarToggle = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
