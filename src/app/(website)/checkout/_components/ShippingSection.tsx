// _components/ShippingSection.tsx
import { Checkout, ShippingmethodIndexSite } from "@/types/apiTypes";
import { Spinner } from "@heroui/spinner";
import RetryError from "@/components/datadisplay/RetryError";
import PayMethods from "./PayMethods";

interface ShippingSectionProps {
  shippings: ShippingmethodIndexSite[];
  shippingsLoading: boolean;
  shippingsError: any;
  shippingsMutate: () => void;
  checkout?: Checkout;
  checkoutHandler: (
    refreshMode?: boolean,
    shippingMethod?: string,
    couponCode?: string,
    addressId?: number,
  ) => void;
  paymentFieldErrors: { [key: string]: string };
  setPaymentFieldErrors: (errors: any) => void;
}

export default function ShippingSection({
  shippings,
  shippingsLoading,
  shippingsError,
  shippingsMutate,
  checkout,
  checkoutHandler,
  paymentFieldErrors,
  setPaymentFieldErrors,
}: ShippingSectionProps) {
  return (
    <>
      <h3 className="mb-2 mt-5 font-bold">روش ارسال:</h3>
      {shippingsLoading ? (
        <div className="grid h-[200px] w-full place-content-center">
          <Spinner />
        </div>
      ) : shippingsError ? (
        <div className="h-[250px]">
          <RetryError onRetry={shippingsMutate} />
        </div>
      ) : (
        <PayMethods
          data={shippings}
          selectedMethodCode={checkout?.selected_shipping_method?.code}
          onChange={(name) => {
            checkoutHandler(true, name);
            if (paymentFieldErrors.shipping_method) {
              setPaymentFieldErrors((prev: any) => ({
                ...prev,
                shipping_method: "",
              }));
            }
          }}
        />
      )}
      {paymentFieldErrors.shipping_method && (
        <p className="mt-2 text-sm text-danger-600" data-payment-error>
          {paymentFieldErrors.shipping_method}
        </p>
      )}
    </>
  );
}
