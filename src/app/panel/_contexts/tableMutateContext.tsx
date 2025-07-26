import { createContext, useContext, useState, ReactNode } from "react";
import { KeyedMutator } from "swr";

interface TableMutateContextProps {
  setMutateFunction: (mutateFunction: KeyedMutator<any>) => void;
  executeMutateFunction: () => void;
}
/* 
usecase: can be where we have different tables with different queries and one form 
and it is hard to track different useSWR urls cache from different components to mutate it and revalidate
so we add the mutate function from useSWR call to this in every table swr fetch call
then we execute the mutate function
*/
const TableMutateContext = createContext<TableMutateContextProps | undefined>(
  undefined,
);

export const TableMutateProvider = ({ children }: { children: ReactNode }) => {
  const [mutateFunction, setMutateFunctionState] = useState<
    KeyedMutator<any> | undefined
  >(undefined);

  const setMutateFunction = (mutateFunction: KeyedMutator<any>) => {
    setMutateFunctionState(() => mutateFunction);
  };

  const executeMutateFunction = () => {
    if (mutateFunction) {
      mutateFunction();
    }
  };

  return (
    <TableMutateContext.Provider
      value={{ setMutateFunction, executeMutateFunction }}
    >
      {children}
    </TableMutateContext.Provider>
  );
};

export const useTableMutateContext = () => {
  const context = useContext(TableMutateContext);
  if (context === undefined) {
    throw new Error(
      "useTableMutateContext must be used within a TableMutateProvider",
    );
  }
  return context;
};
