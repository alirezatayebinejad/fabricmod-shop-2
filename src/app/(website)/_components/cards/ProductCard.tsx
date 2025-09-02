"use client";
import { currency } from "@/constants/staticValues";
import apiCRUD from "@/services/apiCRUD";
import { getAuth } from "@/services/auth";
import {
  ProductCategoryShowSite,
  Index,
  ProductIndexSite,
  ProductShowSite,
} from "@/types/apiTypes";
import formatPrice from "@/utils/formatPrice";
import isSaleActive from "@/utils/isSaleActive";
import { Button } from "@heroui/button";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProductCard({
  product,
  fullSize = false,
}: {
  product:
    | ProductIndexSite["products"][number]
    | ProductCategoryShowSite["data"]["products"][number]
    | ProductShowSite["related_products"][number]
    | Index["latest_products"][number]
    | Index["carousels"][number]["products"][number];
  fullSize?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [isWished, setIsWished] = useState(product ? product.is_wished : false);
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
        product_id: product?.id,
      },
    });
    if (res?.status === "success") {
      setIsWished((prev) => !prev);
    }
    setLoading(false);
  };

  return (
    <div
      className={`group ${
        fullSize
          ? "h-full w-full"
          : "min-w-[280px] max-w-[280px] max-md:min-w-[170px] max-md:max-w-[170px]"
      }`}
    >
      <div className="relative aspect-square !overflow-hidden !rounded-[10px]">
        <Link prefetch={false} href={`/shop/product/${product?.slug}`}>
          <div className="absolute inset-0 flex h-full items-center justify-center overflow-hidden !rounded-[10px]">
            <Image
              src={
                product?.primary_image
                  ? process.env.NEXT_PUBLIC_IMG_BASE + product.primary_image
                  : "/images/imageplaceholder.png"
              }
              alt="banner"
              height={345}
              width={270}
              className={`h-full w-full object-cover object-center transition-opacity ${product?.images?.[0] ? "group-hover:opacity-0" : ""}`}
              style={{ objectPosition: "center" }}
            />
            {product?.images?.[0]?.image && (
              <Image
                src={process.env.NEXT_PUBLIC_IMG_BASE + product.images[0].image}
                alt="banner"
                height={285}
                width={270}
                className="absolute left-0 top-0 h-full w-full object-cover object-center"
                style={{ objectPosition: "center" }}
              />
            )}
          </div>
          {product?.sale_check && (
            <p className="absolute right-5 top-5 rounded-full bg-primary px-1.5 text-TextSize300 text-primary-foreground md:px-3 md:py-1">
              حراج!
            </p>
          )}
        </Link>
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
                router.push(`/shop/product/${product?.slug}`);
              }}
            >
              <Eye className="w-5 text-TextColor max-md:w-4" />
            </Button>
            {/* fake round corner */}
            <span className="absolute -left-3 -top-7 h-5 w-5 rounded-bl-[15px] bg-transparent shadow-[-5px_5px_0px_var(--bodyBg)]"></span>
            <span className="absolute -bottom-3 -right-7 h-5 w-5 rounded-bl-[15px] bg-transparent shadow-[-5px_5px_0px_var(--bodyBg)]"></span>
          </div>
        </div>
      </div>

      <div className="my-3 flex flex-col">
        <h3 className="text-TextSize400 font-bold max-md:text-TextSize300">
          {product?.name}
        </h3>
        <p className="text-TextSize400 text-TextLow max-md:text-TextSize300">
          {product?.price_check ? (
            product.price_check.sale_price &&
            isSaleActive(
              product.price_check.date_sale_from,
              product.price_check.date_sale_to,
            ) ? (
              <>
                <span className="line-through">
                  {formatPrice(product.price_check.price)}
                </span>{" "}
                -{" "}
                <span>
                  {formatPrice(product.price_check.sale_price)} {currency}
                </span>
              </>
            ) : (
              <span>
                {formatPrice(product.price_check.price)} {currency}
              </span>
            )
          ) : (
            <span>ناموجود</span>
          )}
        </p>
      </div>
    </div>
  );
}
