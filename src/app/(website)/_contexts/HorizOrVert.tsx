"use client";
import { createContext, useContext, useState } from "react";

interface HorizOrVertContextState {
  viewMode: "horiz" | "vert";
  toggleViewMode: () => void;
  changeViewMode: (val: "horiz" | "vert") => void;
}

const HorizOrVertContext = createContext<HorizOrVertContextState | undefined>(
  undefined,
);

export const HorizOrVertProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [viewMode, setViewMode] = useState<"horiz" | "vert">("vert");

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "horiz" ? "vert" : "horiz"));
  };
  const changeViewMode = (val: "horiz" | "vert") => {
    setViewMode(val);
  };

  const value: HorizOrVertContextState = {
    viewMode,
    toggleViewMode,
    changeViewMode,
  };

  return (
    <HorizOrVertContext.Provider value={value}>
      {children}
    </HorizOrVertContext.Provider>
  );
};

export const useHorizOrVert = () => {
  const context = useContext(HorizOrVertContext);
  if (!context) {
    throw new Error("useHorizOrVert must be used within a HorizOrVertProvider");
  }
  return context;
};
