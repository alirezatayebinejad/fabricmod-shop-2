import {
  Checkout,
  CheckCoupon,
  ShippingmethodIndexSite,
  Address,
} from "@/types/apiTypes";
import CouponSection from "@/app/(website)/checkout/_components/CouponSection";
import ShippingSection from "@/app/(website)/checkout/_components/ShippingSection";
import PaymentSection from "@/app/(website)/checkout/_components/PaymentSection";

interface CheckoutFormProps {
  checkout?: Checkout;
  shippings: ShippingmethodIndexSite[];
  shippingsLoading: boolean;
  shippingsError: any;
  shippingsMutate: () => void;
  checkoutHandler: (
    refreshMode?: boolean,
    shippingMethod?: string,
    couponCode?: string,
    addressId?: number,
  ) => void;
  paymentFieldErrors: { [key: string]: string };
  setPaymentFieldErrors: (errors: any) => void;
  couponRes?: CheckCoupon;
  setCouponRes: (res?: CheckCoupon) => void;
  basket: any[];
  gatewayName: string;
  setGatewayName: (gateway: string) => void;
  selectedAddress: Address | null;
  onChangeAddress: () => void;
}

function renderAddress(address: Address | null) {
  if (!address) {
    return (
      <div className="rounded border border-border bg-boxBg300 p-4 text-TextColor">
        آدرسی انتخاب نشده است.
      </div>
    );
  }
  return (
    <div className="rounded border border-border bg-boxBg300 p-4">
      <div className="text-sm text-TextColor">{address.address}</div>
      <div className="mt-1 text-xs text-TextColor">
        {address.receiver_name && (
          <span>
            گیرنده: {address.receiver_name}
            {address.receiver_name ? ` - ${address.cellphone}` : ""}
          </span>
        )}
      </div>
      {address.postal_code && (
        <div className="mt-1 text-xs text-TextLow">
          کد پستی: {address.postal_code}
        </div>
      )}
    </div>
  );
}

export default function CheckoutForm({
  checkout,
  shippings,
  shippingsLoading,
  shippingsError,
  shippingsMutate,
  checkoutHandler,
  paymentFieldErrors,
  setPaymentFieldErrors,
  couponRes,
  setCouponRes,
  basket,
  gatewayName,
  setGatewayName,
  selectedAddress,
  onChangeAddress,
}: CheckoutFormProps) {
  return (
    <div className="mt-5 flex flex-col gap-5">
      {/* Address Section */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-semibold">آدرس تحویل سفارش</span>
          <button
            type="button"
            className="rounded bg-secondary-50 px-3 py-1.5 text-sm font-medium text-TextColor transition"
            onClick={onChangeAddress}
          >
            تغییر آدرس
          </button>
        </div>
        {renderAddress(selectedAddress)}
      </div>

      <CouponSection
        basket={basket}
        couponRes={couponRes}
        setCouponRes={setCouponRes}
        checkoutHandler={checkoutHandler}
        paymentFieldErrors={paymentFieldErrors}
      />

      <ShippingSection
        shippings={shippings}
        shippingsLoading={shippingsLoading}
        shippingsError={shippingsError}
        shippingsMutate={shippingsMutate}
        checkout={checkout}
        checkoutHandler={checkoutHandler}
        paymentFieldErrors={paymentFieldErrors}
        setPaymentFieldErrors={setPaymentFieldErrors}
      />

      <PaymentSection
        gatewayName={gatewayName}
        setGatewayName={setGatewayName}
        paymentFieldErrors={paymentFieldErrors}
        setPaymentFieldErrors={setPaymentFieldErrors}
        installment={checkout?.installment}
      />
    </div>
  );
}
