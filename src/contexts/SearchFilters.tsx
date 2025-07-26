import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";

interface FiltersContextState {
  filters: string;
  changeFilters: (query: string | string[]) => void;
  getFilterValue: (key: string) => string | null;
  deleteFilter: (key: string | RegExp, resetPage?: boolean) => void;
  setArrayAsQuery: (
    entries: { name: string; values: string[] | string | undefined }[],
  ) => void;
  setFullFilters: (filters: string) => void;
  resetFilters: () => void;
}

const FiltersContext = createContext<FiltersContextState | undefined>(
  undefined,
);

const FiltersProviderComponent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //this context will reset when route changes
  const pathname = usePathname();
  const currentFiltersParams = useSearchParams();

  const filtersParams = new URLSearchParams(currentFiltersParams);
  const [filters, setFilters] = useState(
    decodeURIComponent(filtersParams.toString()),
  );
  const setFullFilters = (filters: string) => {
    setFilters(decodeURIComponent(filters));
  };

  useEffect(() => {
    setFullFilters(filtersParams.toString());
    // eslint-disable-next-line
  }, [pathname]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(filters);
    const newUrl = `${pathname}${urlSearchParams.toString() ? "?" + urlSearchParams.toString() : ""}`;
    window.history.replaceState({}, "", newUrl);
    // eslint-disable-next-line
  }, [filters]);

  const changeFilters = (query: string | string[]) => {
    /* state update batching in React cause bugs
     when changing multiple query at once so use
    string[] not multiple function call at once */
    const filtersParams = new URLSearchParams(filters);

    const queries = Array.isArray(query) ? query : [query];
    queries.forEach((q) => {
      const [key, value] = q.split("=");
      if (filtersParams.has(key)) {
        filtersParams.set(key, value);
      } else {
        filtersParams.append(key, value);
      }
    });

    const updatedQuery = filtersParams.toString();
    setFullFilters(updatedQuery);
  };

  const getFilterValue = (key: string) => {
    return currentFiltersParams.get(key);
  };

  const deleteFilter = (key: string | RegExp, resetPage: boolean = false) => {
    const filtersParams = new URLSearchParams(filters);
    if (key instanceof RegExp) {
      for (const param of Array.from(filtersParams.keys())) {
        if (key.test(param)) {
          filtersParams.delete(param);
        }
      }
    } else {
      if (filtersParams.has(key)) {
        filtersParams.delete(key);
      }
    }
    if (resetPage) {
      filtersParams.set("page", "1");
    }
    setFullFilters(filtersParams.toString());
  };

  const setArrayAsQuery = (
    entries: { name: string; values: string | string[] | undefined }[],
  ) => {
    const filtersParams = new URLSearchParams(filters);

    entries.forEach(({ name, values }) => {
      // Delete existing array entries
      let index = 0;
      while (filtersParams.has(`${name}[${index}]`)) {
        filtersParams.delete(`${name}[${index}]`);
        index++;
      }
      // Set new array entries
      if (!values) {
        filtersParams.delete(name);
      } else if (typeof values === "string") {
        filtersParams.set(name, values);
      } else {
        values.forEach((value, index) => {
          filtersParams.set(`${name}[${index}]`, value);
        });
      }
    });

    setFullFilters(filtersParams.toString());
  };

  const resetFilters = () => {
    setFullFilters("");
    window.history.replaceState({}, "", pathname);
  };

  const value: FiltersContextState = {
    filters,
    changeFilters,
    getFilterValue,
    deleteFilter,
    setArrayAsQuery,
    setFullFilters,
    resetFilters,
  };

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <FiltersProviderComponent>{children}</FiltersProviderComponent>
    </Suspense>
  );
}

export const useFiltersContext = (): FiltersContextState => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useSidebar must be used within a FiltersProvider");
  }
  return context;
};
