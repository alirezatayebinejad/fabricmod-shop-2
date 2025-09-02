"use client";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import InfoBox from "@/components/datadisplay/InfoBox";
import TableGenerate from "@/components/datadisplay/TableGenerate";
import { currency } from "@/constants/staticValues";
import { useBasket } from "@/contexts/BasketContext";
import { getAuth } from "@/services/auth";
import formatPrice from "@/utils/formatPrice";
import isSaleActive from "@/utils/isSaleActive";
import { Button } from "@heroui/button";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function CartPage() {
  const { basket, removeFromBasket, updateProductCount } = useBasket();
  const params = useSearchParams();
  const errors = params.get("errors");

  const router = useRouter();

  const totalPrice = useMemo(() => {
    const basketTotal = basket
      ?.map((item) => {
        const sVar = item.variations?.find(
          (v) => v.id === item.selectedVariationId,
        );
        const useSale = isSaleActive(
          sVar?.date_sale_from ?? null,
          sVar?.date_sale_to ?? null,
        );
        const unitPrice =
          useSale && sVar?.sale_price ? sVar.sale_price : sVar?.price || 0;
        return unitPrice * item.countBasket;
      })
      .reduce((a, b) => a + b, 0);

    return {
      total: basketTotal,
    };
  }, [basket]);

  return (
    <main>
      <div className="px-12 py-8 max-md:px-4">
        <Breadcrumb
          items={[{ title: "خانه", link: "/" }, { title: "سبدخرید" }]}
        />
        <h1 className="mb-8 text-[42px] font-bold max-md:text-[30px]">
          سبد خرید
        </h1>

        <div className="flex gap-8 max-[1100px]:flex-col">
          <div className="flex-1">
            {errors && (
              <InfoBox
                type="error"
                classNames={{ container: "mt-0" }}
                content={<p>{errors}</p>}
              />
            )}
            <TableGenerate
              stripedRows
              data={{
                headers: [
                  { content: "" },
                  { content: "محصول" },
                  { content: "قيمت" },
                  { content: "نوع" },
                  { content: "تعداد" },
                  { content: "جمع جزء" },
                  { content: "" },
                ],
                body: basket?.map((item) => ({
                  cells: [
                    {
                      data: (
                        <Link
                          prefetch={false}
                          href={"/shop/product/" + item.slug}
                        >
                          <div className="h-[90px] w-[90px]">
                            <Image
                              src={
                                item.primary_image
                                  ? process.env.NEXT_PUBLIC_IMG_BASE +
                                    item.primary_image
                                  : "/images/imageplaceholder.png"
                              }
                              alt={item.name}
                              width={90}
                              height={90}
                              className="w-full object-cover"
                            />
                          </div>
                        </Link>
                      ),
                    },
                    {
                      data: (
                        <Link
                          prefetch={false}
                          href={"/shop/product/" + item.slug}
                        >
                          {item.name}
                        </Link>
                      ),
                    },
                    {
                      data: (() => {
                        const sVar = item.variations?.find(
                          (v) => v.id === item.selectedVariationId,
                        );
                        const useSale = isSaleActive(
                          sVar?.date_sale_from ?? null,
                          sVar?.date_sale_to ?? null,
                        );
                        const unitPrice =
                          useSale && sVar?.sale_price
                            ? sVar.sale_price
                            : sVar?.price || 0;
                        return formatPrice(unitPrice);
                      })(),
                    },
                    {
                      data: item.variations?.find(
                        (v) => v.id === item.selectedVariationId,
                      )?.value,
                    },
                    {
                      data: (
                        <div className="flex items-center">
                          <Minus
                            className="w-3 cursor-pointer text-TextLow transition-colors hover:text-TextColor"
                            onClick={() => {
                              if (item.countBasket > 1) {
                                updateProductCount(
                                  item.id,
                                  item.countBasket - 1,
                                  item.selectedVariationId,
                                );
                              }
                            }}
                          />
                          <span className="mx-2">{item.countBasket}</span>
                          <Plus
                            className="w-3 cursor-pointer text-TextLow transition-colors hover:text-TextColor"
                            onClick={() => {
                              const variationSelected = item.variations?.find(
                                (v) => v.id === item.selectedVariationId,
                              );
                              if (
                                variationSelected &&
                                item.countBasket + 1 <=
                                  variationSelected.quantity
                              )
                                updateProductCount(
                                  item.id,
                                  item.countBasket + 1,
                                  item.selectedVariationId,
                                );
                            }}
                          />
                        </div>
                      ),
                    },
                    {
                      data: (() => {
                        const sVar = item.variations?.find(
                          (v) => v.id === item.selectedVariationId,
                        );
                        const useSale = isSaleActive(
                          sVar?.date_sale_from ?? null,
                          sVar?.date_sale_to ?? null,
                        );
                        const unitPrice =
                          useSale && sVar?.sale_price
                            ? sVar.sale_price
                            : sVar?.price || 0;
                        return formatPrice(unitPrice * item.countBasket);
                      })(),
                    },
                    {
                      data: (
                        <div>
                          <X
                            className="w-4 cursor-pointer text-TextMute transition-colors hover:text-TextColor"
                            onClick={() =>
                              removeFromBasket(
                                item.id,
                                item.selectedVariationId,
                              )
                            }
                          />
                        </div>
                      ),
                    },
                  ],
                })),
              }}
              styles={{
                theads: "!bg-transparent font-[400]",
                container: "shadow-none",
              }}
            />
          </div>
          <div className="w-full max-w-[400px] max-md:max-w-full">
            <div className="sticky top-[150px] flex w-full flex-col gap-10 border-1 border-TextLow p-8">
              <h2 className="text-TextSize700 font-bold">مجموع سبد</h2>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-TextSize400 font-bold">قیمت کل</h3>
                <p className="text-TextSize500 font-bold">
                  {formatPrice(totalPrice.total)} {currency}
                </p>
              </div>

              <Button
                isDisabled={basket?.length < 1}
                className="mt-7 min-h-[60px] rounded-[5px] bg-primary text-primary-foreground"
                onPress={() => {
                  if (!getAuth?.session()?.isLoggedIn) {
                    router.push(`/auth/login?fallback=/checkout`);
                  } else {
                    router.push("/checkout");
                  }
                }}
              >
                رفتن به صورتحساب
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
