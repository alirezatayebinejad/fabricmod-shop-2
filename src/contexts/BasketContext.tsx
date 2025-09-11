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

type BasketData = {
  items: BasketProduct[];
  lastAddedAt: number; //timestamp when any item was last added to basket
};

interface BasketContextState {
  basket: BasketProduct[];
  addToBasket: (
    product: ProductShowSite,
    countBasket: number,
    selectedVariationId: number,
  ) => boolean;
  removeFromBasket: (productId: number, selectedVariationId: number) => boolean;
  removeAllBasket: () => void;
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
    if (storedBasket) {
      const basketData: BasketData = JSON.parse(storedBasket);

      // Check if basket has the new format with lastAddedAt
      if (basketData.lastAddedAt) {
        const now = Date.now();
        const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        // If more than 1 day has passed since last addition, clear entire basket
        if (now - basketData.lastAddedAt > oneDayInMs) {
          localStorage.removeItem("basket");
          return [];
        }

        return basketData.items || [];
      } else {
        // Handle old format - clear the basket since we can't determine when items were added
        localStorage.removeItem("basket");
        return [];
      }
    }
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

      const basketData: BasketData = {
        items: updatedBasket,
        lastAddedAt: Date.now(),
      };

      localStorage.setItem("basket", JSON.stringify(basketData));
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

      const basketData: BasketData = {
        items: updatedBasket,
        lastAddedAt: Date.now(), // Update timestamp even for removals
      };

      localStorage.setItem("basket", JSON.stringify(basketData));
      setBasket(updatedBasket);
      return true;
    }
    return false;
  };

  const removeAllBasket = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("basket");
    }
    setBasket([]);
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

      const basketData: BasketData = {
        items: currentBasket,
        lastAddedAt: Date.now(), // Update timestamp for count changes
      };

      localStorage.setItem("basket", JSON.stringify(basketData));
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
        removeAllBasket,
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
