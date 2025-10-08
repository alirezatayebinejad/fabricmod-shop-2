// _components/PriceSummary.tsx
import TableGenerate from "@/components/datadisplay/TableGenerate";
import { Checkout } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import formatPrice from "@/utils/formatPrice";
import { currency, weight } from "@/constants/staticValues";

interface PriceSummaryProps {
  checkout?: Checkout;
  paymentError?: string | { [key: string]: string };
  paymentFieldErrors: { [key: string]: string };
  payLoading: boolean;
  handlePayment: () => void;
}

export default function PriceSummary({
  checkout,
  paymentError,
  paymentFieldErrors,
  payLoading,
  handlePayment,
}: PriceSummaryProps) {
  return (
    <>
      <TableGenerate
        data={{
          headers: [],
          body: [
            {
              cells: [
                { data: <h3 className="font-bold">قیمت کل سبد</h3> },
                {
                  data: `${checkout ? formatPrice(checkout.cartTotalAmount) : ""} ${currency}`,
                },
              ],
              className: "bg-boxBg250",
            },
            {
              cells: [
                { data: <h3 className="font-bold">هزینه ارسال</h3> },
                {
                  data: `${checkout ? formatPrice(checkout.cartDeliveryAmount) : ""} ${currency}`,
                },
              ],
              className: "bg-boxBg250",
            },
            {
              cells: [
                { data: <h3 className="font-bold">وزن</h3> },
                {
                  data: `${checkout ? formatPrice(checkout.cartWeight) : ""} ${weight}`,
                },
              ],
              className: "bg-boxBg250",
            },
            {
              cells: [
                { data: <h3 className="font-bold">تخفیف</h3> },
                {
                  data: `${checkout ? formatPrice(checkout.cartSaleAmount + (checkout.coupon ? checkout.coupon.couponTotalAmount : 0)) : ""} ${currency}`,
                },
              ],
              className: "bg-boxBg250",
            },
            {
              cells: [
                { data: <h3 className="font-bold">مجموع</h3> },
                {
                  data: `${checkout ? formatPrice(checkout.cartTotalPay) : ""} ${currency}`,
                },
              ],
              className: "bg-boxBg300",
            },
          ],
        }}
        styles={{
          theads: "!bg-boxBg300 font-[400]",
          container: "shadow-none border-1 rounded-none",
        }}
      />
      {paymentError && Object.keys(paymentFieldErrors).length === 0 && (
        <div
          className="my-4 rounded-md bg-danger-50 p-4 text-danger-600"
          data-payment-error
        >
          {typeof paymentError === "string"
            ? paymentError
            : "لطفا خطای های موجود در این صفحه را بررسی کنید"}
        </div>
      )}
      <Button
        className="my-10 min-h-[50px] w-full !rounded-[5px] border-border bg-primary text-primary-foreground"
        isDisabled={payLoading || !checkout}
        onPress={handlePayment}
      >
        {payLoading ? <Spinner size="sm" /> : "پرداخت"}
      </Button>
    </>
  );
}
