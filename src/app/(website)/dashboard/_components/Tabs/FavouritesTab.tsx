import TableGenerate from "@/components/datadisplay/TableGenerate";
import { Button } from "@heroui/button";
import { Eye, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { Spinner } from "@heroui/spinner";
import { WishlistIndex } from "@/types/apiTypes";
import formatPrice from "@/utils/formatPrice";
import RetryError from "@/components/datadisplay/RetryError";
import Link from "next/link";
import { currency } from "@/constants/staticValues";
import { getAuth } from "@/services/auth";
import toast from "react-hot-toast";
import isSaleActive from "@/utils/isSaleActive";

export default function FavouritesTab() {
  const { data, error, isLoading, mutate } = useSWR(
    `next/profile/wishlists`,
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

  if (isLoading)
    return (
      <div className="grid h-[300px] place-self-center">
        <Spinner color="primary" />
      </div>
    );
  if (error) {
    return (
      <div className="h-[250px]">
        <RetryError onRetry={() => mutate()} />
      </div>
    );
  }

  return (
    <div>
      <TableGenerate
        stripedRows
        data={{
          headers: [
            { content: "عکس" },
            { content: "عنوان" },
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
                    ? formatPrice(
                        (item.product.sale_check &&
                          isSaleActive(
                            item.product.price_check.date_sale_from,
                            item.product.price_check.date_sale_to,
                          ) &&
                          item.product.price_check.sale_price) ||
                          item.product.price_check.price,
                      ) +
                      " " +
                      currency
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
                      <Eye className="w-5 text-TextLow max-md:w-4" />
                    </Button>
                    <Button
                      variant="light"
                      isIconOnly
                      size="sm"
                      isDisabled={loading}
                      onPress={() => {
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
          theads: "!bg-transparent font-[400] hidden border-none",
          container: "shadow-none",
        }}
      />
    </div>
  );
}
