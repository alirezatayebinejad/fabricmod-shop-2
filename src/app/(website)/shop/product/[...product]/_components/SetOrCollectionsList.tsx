import { currency } from "@/constants/staticValues";
import { ProductShowSite } from "@/types/apiTypes";
import formatPrice from "@/utils/formatPrice";
import isSaleActive from "@/utils/isSaleActive";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SetOrCollectionsList({
  isCollection,
  data,
}: {
  isCollection: boolean;
  data: ProductShowSite;
}) {
  return (
    <div
      className="flex flex-col flex-wrap items-center gap-5 pb-2 pt-10"
      id="setOrCollection"
    >
      <h3 className="font-bold">
        {isCollection ? "محصولات ست:" : "محصولات تکی:"}
      </h3>
      <div className="flex w-full flex-wrap justify-center gap-4">
        {(isCollection ? data.collections : data.singles)?.map((d) => (
          <Link href={"/shop/product/" + d.slug} key={d.id}>
            <div
              key={d.id}
              className="flex flex-row gap-1 rounded-lg border border-border bg-boxBg250 p-2"
            >
              <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                <Image
                  width={50}
                  height={50}
                  src={
                    d.primary_image
                      ? process.env.NEXT_PUBLIC_IMG_BASE + d.primary_image
                      : "/images/imageplaceholder.png"
                  }
                  alt={d.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col items-start justify-center gap-2">
                <div className="my-3 flex flex-col">
                  <h3 className="text-TextSize400 font-bold max-md:text-TextSize300">
                    {d?.name}
                  </h3>
                  <p className="text-TextSize400 text-TextLow max-md:text-TextSize300">
                    {d?.price_check ? (
                      d.price_check.sale_price &&
                      d.sale_check &&
                      isSaleActive(
                        d.price_check.date_sale_from,
                        d.price_check.date_sale_to,
                      ) ? (
                        <>
                          <span className="line-through">
                            {formatPrice(d.price_check.price)}
                          </span>{" "}
                          -{" "}
                          <span>
                            {formatPrice(d.price_check.sale_price)} {currency}
                          </span>
                        </>
                      ) : (
                        <span>
                          {formatPrice(d.price_check.price)} {currency}
                        </span>
                      )
                    ) : (
                      <span>ناموجود</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
