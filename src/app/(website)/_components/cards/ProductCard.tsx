import { currency } from "@/constants/staticValues";
import {
  ProductCategoryShowSite,
  Index,
  ProductIndexSite,
  ProductShowSite,
} from "@/types/apiTypes";
import formatPrice from "@/utils/formatPrice";
import isSaleActive from "@/utils/isSaleActive";
import Image from "next/image";
import Link from "next/link";
import ProductCardClient from "./ProductCardClient";

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
            {product?.back_image ? (
              <Image
                src={process.env.NEXT_PUBLIC_IMG_BASE! + product.back_image}
                alt={product?.name || "product image"}
                height={285}
                width={270}
                className="absolute left-0 top-0 h-full w-full object-cover object-center opacity-0 transition-opacity group-hover:opacity-100"
                style={{ objectPosition: "center" }}
              />
            ) : (
              product?.images?.[0]?.image && (
                <Image
                  src={
                    process.env.NEXT_PUBLIC_IMG_BASE! + product.images[0].image
                  }
                  alt="banner"
                  height={285}
                  width={270}
                  className={`absolute left-0 top-0 h-full w-full object-cover object-center opacity-0 transition-opacity group-hover:opacity-100`}
                  style={{ objectPosition: "center" }}
                />
              )
            )}
            <Image
              src={
                product?.primary_image
                  ? (process.env.NEXT_PUBLIC_IMG_BASE || "") +
                    product.primary_image
                  : "/images/imageplaceholder.png"
              }
              alt={product?.name || "product image"}
              height={345}
              width={270}
              className={`h-full w-full object-cover object-center transition-opacity ${product?.images?.[0] || ("back_image" in product && product?.back_image) ? "group-hover:opacity-0" : ""}`}
              style={{ objectPosition: "center" }}
            />
          </div>
          {product?.sale_check && (
            <p className="absolute right-5 top-5 rounded-full bg-primary px-1.5 text-TextSize300 text-primary-foreground md:px-3 md:py-1">
              حراج!
            </p>
          )}
        </Link>
        <ProductCardClient
          productId={product?.id}
          productSlug={product?.slug}
          initialIsWished={product?.is_wished || false}
        />
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
