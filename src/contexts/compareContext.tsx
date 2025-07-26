import { localstorageNames } from "@/constants/cacheNames";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

interface CompareContextState {
  compares: string[];
  addToCompare: (prodSlug: string) => boolean;
  removeCompare: (prodSlug: string) => boolean;
  isComparedExists: (slug: string) => boolean;
  isMounted: boolean;
}

export const CompareContext = createContext<CompareContextState | undefined>(
  undefined,
);

const getComparesFromLocalStorage = (): string[] => {
  if (typeof window !== "undefined") {
    const storedCompares = localStorage.getItem(localstorageNames.compares);
    return storedCompares ? JSON.parse(storedCompares) : [];
  }
  return [];
};

const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compares, setCompares] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setCompares(getComparesFromLocalStorage());
    setIsMounted(true);
  }, []);

  const isComparedExists = (slug: string): boolean => {
    return compares.includes(slug);
  };

  const addToCompare = (prodSlug: string): boolean => {
    const prodSlugs = getComparesFromLocalStorage();
    if (!isComparedExists(prodSlug)) {
      const updatedProductIds = [...prodSlugs, prodSlug];
      localStorage.setItem(
        localstorageNames.compares,
        JSON.stringify(updatedProductIds),
      );
      setCompares(updatedProductIds);
      return true;
    }
    return false;
  };

  const removeCompare = (prodSlug: string): boolean => {
    const prodSlugs = getComparesFromLocalStorage();
    if (isComparedExists(prodSlug)) {
      const updatedProductIds = prodSlugs.filter((slug) => slug !== prodSlug);
      localStorage.setItem(
        localstorageNames.compares,
        JSON.stringify(updatedProductIds),
      );
      setCompares(updatedProductIds);
      return true;
    }
    return false;
  };

  return (
    <CompareContext.Provider
      value={{
        compares,
        addToCompare,
        removeCompare,
        isComparedExists,
        isMounted,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};

export default CompareProvider;
