"use client";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { ProductShowSite } from "@/types/apiTypes";

type BasketProduct = {
  countBasket: number; //how many of this item is added
  selectedVariationId: number; //selected variation of the product
} & ProductShowSite;

interface BasketContextState {
  basket: BasketProduct[];
  addToBasket: (
    product: ProductShowSite,
    countBasket: number,
    selectedVariationId: number,
  ) => boolean;
  removeFromBasket: (productId: number, selectedVariationId: number) => boolean;
  isProductInBasket: (
    productId: number,
    selectedVariationId: number,
  ) => boolean;
  updateProductCount: (
    productId: number,
    countBasket: number,
    selectedVariationId: number,
  ) => boolean;
  getProductCount: (productId: number, selectedVariationId: number) => number;
  isMounted: boolean;
}

export const BasketContext = createContext<BasketContextState | undefined>(
  undefined,
);

const getBasketFromLocalStorage = (): BasketProduct[] => {
  if (typeof window !== "undefined") {
    const storedBasket = localStorage.getItem("basket");
    return storedBasket ? JSON.parse(storedBasket) : [];
  }
  return [];
};

const BasketProvider = ({ children }: { children: ReactNode }) => {
  const [basket, setBasket] = useState<BasketProduct[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setBasket(getBasketFromLocalStorage());
    setIsMounted(true);
  }, []);

  const isProductInBasket = (
    productId: number,
    selectedVariationId: number,
  ): boolean => {
    return basket.some(
      (product) =>
        product.id === productId &&
        product.selectedVariationId === selectedVariationId,
    );
  };

  const getProductCount = (
    productId: number,
    selectedVariationId: number,
  ): number => {
    const found = basket.find(
      (product) =>
        product.id === productId &&
        product.selectedVariationId === selectedVariationId,
    );
    return found ? found.countBasket : 0;
  };

  const addToBasket = (
    product: ProductShowSite,
    countBasket: number,
    selectedVariationId: number,
  ): boolean => {
    const currentBasket = getBasketFromLocalStorage();
    if (!isProductInBasket(product.id, selectedVariationId)) {
      const updatedBasket = [
        ...currentBasket,
        { ...product, countBasket, selectedVariationId },
      ];
      localStorage.setItem("basket", JSON.stringify(updatedBasket));
      setBasket(updatedBasket);
      return true;
    }
    return false;
  };

  const removeFromBasket = (
    productId: number,
    selectedVariationId: number,
  ): boolean => {
    const currentBasket = getBasketFromLocalStorage();
    if (isProductInBasket(productId, selectedVariationId)) {
      const updatedBasket = currentBasket.filter(
        (product) =>
          !(
            product.id === productId &&
            product.selectedVariationId === selectedVariationId
          ),
      );
      localStorage.setItem("basket", JSON.stringify(updatedBasket));
      setBasket(updatedBasket);
      return true;
    }
    return false;
  };

  const updateProductCount = (
    productId: number,
    countBasket: number,
    selectedVariationId: number,
  ): boolean => {
    const currentBasket = getBasketFromLocalStorage();
    const productIndex = currentBasket.findIndex(
      (product) =>
        product.id === productId &&
        product.selectedVariationId === selectedVariationId,
    );
    if (productIndex !== -1) {
      currentBasket[productIndex].countBasket = countBasket;
      localStorage.setItem("basket", JSON.stringify(currentBasket));
      setBasket(currentBasket);
      return true;
    }
    return false;
  };

  return (
    <BasketContext.Provider
      value={{
        basket,
        addToBasket,
        removeFromBasket,
        isProductInBasket,
        updateProductCount,
        getProductCount,
        isMounted,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
};

export default BasketProvider;
