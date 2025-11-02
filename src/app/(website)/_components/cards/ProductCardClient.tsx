"use client";
import apiCRUD from "@/services/apiCRUD";
import { getAuth } from "@/services/auth";
import { Button } from "@heroui/button";
import { Eye, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProductCardClientProps {
  productId?: number;
  productSlug?: string;
  initialIsWished?: boolean;
}

export default function ProductCardClient({
  productId,
  productSlug,
  initialIsWished = false,
}: ProductCardClientProps) {
  const [loading, setLoading] = useState(false);
  const [isWished, setIsWished] = useState(initialIsWished);
  const router = useRouter();

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
        product_id: productId,
      },
    });
    if (res?.status === "success") {
      setIsWished((prev) => !prev);
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        className={`group/heart absolute left-3 top-4 h-7 w-7 !min-w-0 translate-y-[60%] rounded-full !text-TextSize400 opacity-0 shadow-md transition-all duration-400 hover:bg-primary group-hover:translate-y-[0%] group-hover:opacity-100 md:h-10 md:w-10 ${
          isWished ? "bg-primary" : "bg-boxBg100"
        }`}
        isIconOnly
        onClick={favHandler}
        isLoading={loading}
      >
        <Heart
          className={`w-5 text-TextColor group-hover/heart:text-primary-foreground max-md:w-4 ${
            isWished ? "text-primary-foreground" : "text-TextLow"
          }`}
        />
      </Button>
      <div className="absolute bottom-0 left-0 h-auto translate-y-[100%] rounded-tr-[20px] bg-bodyBg pb-3 pl-3 pr-2 pt-2 transition-transform duration-400 group-hover:translate-y-[0]">
        <div className="relative">
          <Button
            className="h-7 w-7 !min-w-0 rounded-full bg-boxBg100 !text-TextSize400 text-primary-foreground dark md:h-10 md:w-10"
            isIconOnly
            onPress={() => {
              if (productSlug) {
                router.push(`/shop/product/${productSlug}`);
              }
            }}
          >
            <Eye className="w-5 text-TextColor max-md:w-4" />
          </Button>
          {/* fake round corner */}
          <span className="absolute -left-3 -top-7 h-5 w-5 rounded-bl-[15px] bg-transparent shadow-[-5px_5px_0px_var(--bodyBg)]"></span>
          <span className="absolute -bottom-3 -right-7 h-5 w-5 rounded-bl-[15px] bg-transparent shadow-[-5px_5px_0px_var(--bodyBg)]"></span>
        </div>
      </div>
    </>
  );
}

