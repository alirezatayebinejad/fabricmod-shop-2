"use client";
import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Check, FlipHorizontal, Heart, Minus, Plus } from "lucide-react";
import { useCompare } from "@/contexts/compareContext";
import toast from "react-hot-toast";
import { useBasket } from "@/contexts/BasketContext";
import { ProductShowSite } from "@/types/apiTypes";
import apiCRUD from "@/services/apiCRUD";
import { getAuth } from "@/services/auth";

export default function ActionBtns({
  product,
  selectedVariation,
}: {
  product?: ProductShowSite;
  selectedVariation: ProductShowSite["variations"][number] | undefined;
}) {
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isWished, setIsWished] = useState(product ? product.is_wished : false);
  const { addToCompare, isComparedExists, removeCompare } = useCompare();
  const {
    addToBasket,
    removeFromBasket,
    isProductInBasket,
    updateProductCount,
    getProductCount,
  } = useBasket();
  const isCompareAdded = product ? isComparedExists(product?.slug) : undefined;
  const isBasketAdded =
    product && selectedVariation
      ? isProductInBasket(product.id, selectedVariation.id)
      : undefined;

  useEffect(() => {
    if (product && selectedVariation) {
      const initialCount = getProductCount(product.id, selectedVariation.id);
      setCount(initialCount || 1);
    }
  }, [product, selectedVariation, getProductCount]);

  const increment = () => {
    if (selectedVariation && product && count < selectedVariation.quantity) {
      if (isBasketAdded) {
        updateProductCount(product.id, count + 1, selectedVariation.id);
        toast.success("تعداد در سبد افزایش یافت");
      }
      setCount((prev) => prev + 1);
    }
  };

  const decrement = () => {
    if (isBasketAdded && product && selectedVariation && count > 1) {
      updateProductCount(product.id, count - 1, selectedVariation.id);
      toast.success("تعداد در سبد کاهش یافت");
    }
    setCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const compareHandler = async (slug: string) => {
    setLoading(true);
    const isAdded = addToCompare(slug);
    if (isAdded) {
      toast.success("محصول به مقایسه ها اضافه شد");
    } else {
      const isRemoved = removeCompare(slug);
      if (isRemoved) {
        toast.success("محصول از مقایسه حذف شد");
      }
    }
    setLoading(false);
  };

  const basketHandler = async (product: ProductShowSite) => {
    setLoading(true);
    const isAdded =
      selectedVariation && addToBasket(product, count, selectedVariation.id);
    if (isAdded) {
      toast.success("محصول به سبد اضافه شد");
    } else {
      const isRemoved =
        selectedVariation && removeFromBasket(product.id, selectedVariation.id);
      if (isRemoved) {
        toast.success("محصول از سبد حذف شد");
      }
    }
    setLoading(false);
  };

  const favHandler = async () => {
    const isLoggedIn = getAuth.session()?.isLoggedIn;
    if (!isLoggedIn) {
      toast.error("ابتدا به سايت وارد شويد.");
      return;
    }
    setLoading(true);
    const res = await apiCRUD({
      urlSuffix: "next/profile/wishlists/toggle",
      method: "POST",
      data: {
        product_id: product?.id,
      },
    });
    if (res?.status === "success") {
      setIsWished((prev) => !prev);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center border-1">
          <button onClick={decrement} className="px-3 disabled:opacity-30">
            <Minus className="w-3.5 text-TextColor" />
          </button>
          <div className="mx-4">{count}</div>
          <button onClick={increment} className="px-3 disabled:opacity-30">
            <Plus className="w-3.5 text-TextColor" />
          </button>
        </div>
        <Button
          onPress={() => {
            if (product) basketHandler(product);
          }}
          className={`h-[45px] rounded-[5px] bg-primary px-7 text-primary-foreground hover:bg-TextColor`}
          startContent={isBasketAdded ? <Check className="w-4" /> : null}
        >
          {isBasketAdded ? "حذف از سبد خرید" : "افزودن به سبد خرید"}
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        <Button
          variant="light"
          className={`mt-4 rounded-[5px] ${isWished ? "bg-boxBg300" : ""}`}
          onClick={favHandler}
          isLoading={loading}
        >
          <Heart className="w-5 text-TextLow" />
          {isWished ? "حذف از علاقمندی" : "افزودن به علاقمندی"}
        </Button>
        <Button
          variant="light"
          className={`mt-4 rounded-[5px] ${isCompareAdded ? "bg-boxBg300" : ""}`}
          onPress={() => {
            if (product) compareHandler(product?.slug);
          }}
        >
          <FlipHorizontal className="w-[20px] text-TextLow" />
          {isCompareAdded ? "حذف از مقایسه" : "افزودن به مقایسه"}
        </Button>
      </div>
    </>
  );
}
