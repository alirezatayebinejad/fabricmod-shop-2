import TableGenerate from "@/components/datadisplay/TableGenerate";
import { Checkout } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import Image from "next/image";
import formatPrice from "@/utils/formatPrice";

interface OrderSummaryProps {
  checkout?: Checkout;
  showProductsTable: boolean;
  setShowProductsTable: (show: boolean) => void;
  basket: any[];
  paymentFieldErrors: { [key: string]: string };
}

export default function OrderSummary({
  checkout,
  showProductsTable,
  setShowProductsTable,
  paymentFieldErrors,
}: OrderSummaryProps) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-bold">سفارش شما</h2>
        <Button
          className="rounded-[5px] border-border bg-boxBg200 text-TextColor md:hidden"
          variant="bordered"
          onPress={() => setShowProductsTable(!showProductsTable)}
        >
          {showProductsTable ? "مخفی کردن" : "نمایش محصولات"}
        </Button>
      </div>
      <div
        style={{
          display: showProductsTable ? "block" : "none",
        }}
      >
        <TableGenerate
          data={{
            headers: [
              { content: "عکس" },
              { content: "محصول" },
              { content: "نوع" },
              { content: "تعداد" },
              { content: "قیمت کل" },
            ],
            body: checkout?.items?.map((item) => ({
              cells: [
                {
                  data: (
                    <Image
                      src={
                        item.product?.primary_image
                          ? process.env.NEXT_PUBLIC_IMG_BASE +
                            item.product?.primary_image
                          : "/images/imageplaceholder.png"
                      }
                      alt={item.product?.name}
                      height={100}
                      width={100}
                      className="z-0 object-cover transition-transform duration-400 group-hover:scale-110"
                    />
                  ),
                },
                { data: item.product?.name },
                {
                  data: (
                    <p>
                      {item.variation.attribute?.name +
                        ": " +
                        item.variation.value}
                    </p>
                  ),
                },
                { data: <p>{item.quantity}</p> },
                { data: <p>{formatPrice(item.price)}</p> },
              ],
              className: "",
            })),
          }}
          styles={{
            theads: "!bg-boxBg300 font-[400]",
            container: "shadow-none border-1 rounded-none",
          }}
        />
      </div>
      {paymentFieldErrors.products && (
        <p className="mt-2 text-sm text-danger-600" data-payment-error>
          {paymentFieldErrors.products}
        </p>
      )}
    </>
  );
}
