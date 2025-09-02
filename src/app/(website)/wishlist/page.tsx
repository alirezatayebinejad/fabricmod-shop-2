"use client";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import InfoBox from "@/components/datadisplay/InfoBox";
import RetryError from "@/components/datadisplay/RetryError";
import TableGenerate from "@/components/datadisplay/TableGenerate";
import { useFiltersContext } from "@/contexts/SearchFilters";
import apiCRUD from "@/services/apiCRUD";
import { Button } from "@heroui/button";
import { Eye, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
import { Spinner } from "@heroui/spinner";
import { WishlistIndex } from "@/types/apiTypes";
import formatPrice from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { getAuth } from "@/services/auth";
import isSaleActive from "@/utils/isSaleActive";

export default function WhishlistPage() {
  const { filters } = useFiltersContext();
  const router = useRouter();
  const isLoggedIn = getAuth.session()?.isLoggedIn;

  const { data, error, isLoading, mutate } = useSWR(
    isLoggedIn && `next/profile/wishlists${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const [loading, setLoading] = useState(false);
  const wishlist: WishlistIndex[] = data?.data;

  const favHandler = async (id: number) => {
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
        product_id: id,
      },
    });
    if (res?.status === "success") {
      mutate();
    }
    setLoading(false);
  };

  return (
    <main>
      <div className="px-12 py-8 max-md:px-4">
        <Breadcrumb
          items={[
            { title: "خانه", link: "/" },
            { title: "لیست علاقه مندی ها" },
          ]}
        />
        <h1 className="mb-8 text-[42px] font-bold max-md:text-[30px]">
          لیست علاقه مندی ها
        </h1>
        {!isLoggedIn ? (
          <div className="text-center">
            <p className="mb-4">
              برای مشاهده لیست علاقه‌مندی‌ها، لطفاً وارد شوید.
            </p>
            <Button as={Link} href="/auth/login">
              ورود به سایت
            </Button>
          </div>
        ) : (
          <>
            <InfoBox
              type="info"
              content={
                <>
                  برای اضافه کردن محصولات به لیست علاقمندی در فروشگاه بر روی
                  دکمه افزودن به لیست علقمندی کلیک کنید.
                </>
              }
            />
            {isLoading ? (
              <div className="grid h-[300px] place-self-center">
                <Spinner color="primary" />
              </div>
            ) : error ? (
              <div className="h-[250px]">
                <RetryError onRetry={() => mutate()} />
              </div>
            ) : (
              <TableGenerate
                stripedRows
                data={{
                  headers: [
                    { content: "عکس" },
                    { content: "نام" },
                    { content: "قیمت" },
                    { content: "" },
                  ],
                  body: wishlist?.map((item) => ({
                    cells: [
                      {
                        data: (
                          <div className="w-[90px]">
                            <Image
                              src={
                                item.product.primary_image
                                  ? process.env.NEXT_PUBLIC_IMG_BASE +
                                    item.product.primary_image
                                  : "/images/imageplaceholder.png"
                              }
                              alt={item.product.name}
                              width={90}
                              height={90}
                              className="h-auto w-full rounded-md object-cover"
                            />
                          </div>
                        ),
                      },
                      { data: item.product.name },
                      {
                        data:
                          typeof item.product.price_check !== "boolean"
                            ? "قیمت: " +
                              formatPrice(
                                (item.product.sale_check &&
                                  isSaleActive(
                                    item.product.price_check.date_sale_from,
                                    item.product.price_check.date_sale_to,
                                  ) &&
                                  item.product.price_check.sale_price) ||
                                  item.product.price_check.price,
                              )
                            : "ناموجود",
                      },
                      {
                        data: (
                          <div className="flex items-center justify-end gap-3">
                            <Button
                              as={Link}
                              href={"/shop/product/" + item.product.slug}
                              variant="light"
                              isIconOnly
                              size="sm"
                            >
                              <Eye
                                className="w-5 text-TextLow max-md:w-4"
                                onClick={() => {
                                  router.push("/shop/" + item.product.slug);
                                }}
                              />
                            </Button>
                            <Button
                              variant="light"
                              isIconOnly
                              size="sm"
                              isDisabled={loading}
                              onClick={() => {
                                favHandler(item.product.id);
                              }}
                            >
                              <X className="w-5 text-TextLow max-md:w-4" />
                            </Button>
                          </div>
                        ),
                      },
                    ],
                  })),
                }}
                styles={{
                  theads: "!bg-transparent font-[400] hidden",
                  container: "shadow-none",
                }}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
