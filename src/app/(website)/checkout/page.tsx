"use client";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import { useBasket } from "@/contexts/BasketContext";
import apiCRUD from "@/services/apiCRUD";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import {
  Checkout,
  CheckCoupon,
  Address,
  ShippingmethodIndexSite,
} from "@/types/apiTypes";
import RetryError from "@/components/datadisplay/RetryError";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getScreenWidth } from "@/utils/getScreen";
import AddressSelectionOverlay from "@/app/(website)/checkout/_components/AddressSelectionOverlay";
import OrderSummary from "@/app/(website)/checkout/_components/OrderSummary";
import CheckoutForm from "@/app/(website)/checkout/_components/checkoutForm";
import PriceSummary from "@/app/(website)/checkout/_components/PriceSummary";

export default function CheckoutPage() {
  const { basket, isMounted } = useBasket();
  const [checkout, setCheckout] = useState<Checkout>();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | { [key: string]: string }>();
  const [paymentError, setPaymentError] = useState<
    string | { [key: string]: string }
  >();
  const [paymentFieldErrors, setPaymentFieldErrors] = useState<{
    [key: string]: string;
  }>({});
  const [scrollToError, setScrollToError] = useState(false);
  const [couponRes, setCouponRes] = useState<CheckCoupon>();
  const [payLoading, setPayLoading] = useState(false);
  const [gatewayName, setGatewayName] = useState("sep");
  const [showProductsTable, setShowProductsTable] = useState(false);
  const [createdAddressId, setCreatedAddressId] = useState<number | null>(null);
  const [showAddressOverlay, setShowAddressOverlay] = useState(true);
  const [selectedAddressForCheckout, setSelectedAddressForCheckout] = useState<
    number | null
  >(null);

  const router = useRouter();

  const {
    data: shippingsRes,
    isLoading: shippingsLoading,
    error: shippingsError,
    mutate: shippingsMutate,
  } = useSWR(
    `next/cart/shipping-methods`,
    (url) => url && apiCRUD({ urlSuffix: url }),
  );
  const shippings: ShippingmethodIndexSite[] = shippingsRes?.data;

  const {
    data: addressRes,
    isLoading: addressLoading,
    error: addressError,
    mutate: addressMutate,
  } = useSWR(
    `next/profile/addresses`,
    (url) => url && apiCRUD({ urlSuffix: url }),
  );
  const addresses: Address[] = addressRes?.data;

  // Find the selected address object to pass to CheckoutForm
  const selectedAddress =
    addresses?.find((a) => a.id === selectedAddressForCheckout) || null;

  const checkoutHandler = async (
    refreshMode = false,
    shippingMethod?: string,
    couponCode = undefined as string | undefined,
    addressId?: number,
  ) => {
    setError(undefined);
    if (refreshMode) setRefreshing(true);
    else setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const res = await apiCRUD({
      urlSuffix: "next/cart/checkout",
      method: "POST",
      noToast: refreshMode,
      data: {
        shipping_method:
          shippingMethod ||
          checkout?.selected_shipping_method?.code ||
          undefined,
        address_id: addressId || checkout?.selected_address?.id || undefined,
        coupon: couponCode,
        products: basket?.map((p) => ({
          product_id: p.id,
          qty: p.countBasket,
          variation_id: p.selectedVariationId,
        })),
      },
    });

    if (res?.status === "success") {
      setCheckout(res.data);
    } else {
      setError(res?.message);
    }

    if (refreshMode) setRefreshing(false);
    else setLoading(false);
  };

  const handlePayment = async () => {
    if (!checkout) return;
    setPayLoading(true);
    setPaymentError(undefined);
    setPaymentFieldErrors({});

    const addressIdToUse = createdAddressId || checkout.selected_address?.id;

    const paymentData = {
      shipping_method: checkout.selected_shipping_method?.code,
      address_id: addressIdToUse,
      coupon: couponRes?.code,
      products: basket?.map((p) => ({
        product_id: p.id,
        qty: p.countBasket,
        variation_id: p.selectedVariationId,
      })),
      payment_method: "online",
      gateway_name: gatewayName,
    };

    const res = await apiCRUD({
      urlSuffix: "next/cart/payment",
      method: "POST",
      data: paymentData,
    });

    if (res?.status === "success" && res.data?.redirect_url) {
      window.location.href = res.data.redirect_url;
    } else {
      if (typeof res?.message === "object" && res.message) {
        setPaymentFieldErrors(res.message);
        setScrollToError(true);
      } else {
        setPaymentError(res?.message || "خطا در پرداخت");
        setScrollToError(true);
      }
    }
    setPayLoading(false);
  };

  const handleConfirmAddress = () => {
    if (selectedAddressForCheckout) {
      setShowAddressOverlay(false);
      checkoutHandler(false, undefined, undefined, selectedAddressForCheckout);
    }
  };

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string" ? error : JSON.stringify(error);
      router.push(`/cart?errors=${encodeURIComponent(errorMessage)}`);
    }
  }, [error, router]);

  useEffect(() => {
    if (!isMounted) return;

    if (basket && basket.length === 0) {
      router.push("/cart");
    }
  }, [isMounted, basket, router]);

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressForCheckout) {
      setSelectedAddressForCheckout(addresses[0].id);
    }
  }, [addresses, selectedAddressForCheckout]);

  useEffect(() => {
    if (getScreenWidth() > 768) {
      setShowProductsTable(true);
    }
  }, []);

  useEffect(() => {
    if (scrollToError) {
      const errorElements = document.querySelectorAll("[data-payment-error]");
      if (errorElements.length > 0) {
        errorElements[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      setScrollToError(false);
    }
  }, [scrollToError, paymentFieldErrors, paymentError]);

  useEffect(() => {
    if (
      createdAddressId &&
      addresses &&
      addresses.some((a) => a.id === createdAddressId)
    ) {
      if (checkout?.selected_address?.id !== createdAddressId) {
        checkoutHandler(true, undefined, undefined, createdAddressId);
      }
    }
    //eslint-disable-next-line
  }, [addresses, createdAddressId]);

  if (showAddressOverlay) {
    return (
      <AddressSelectionOverlay
        addresses={addresses}
        addressLoading={addressLoading}
        addressError={addressError}
        addressMutate={addressMutate}
        selectedAddressId={selectedAddressForCheckout}
        onSelectAddress={setSelectedAddressForCheckout}
        onConfirm={handleConfirmAddress}
        setCreatedAddressId={setCreatedAddressId}
        addressMutateCallback={addressMutate}
      />
    );
  }

  return (
    <main className="relative">
      {refreshing && (
        <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-white/55">
          <div className="flex min-h-dvh items-center justify-center">
            <Spinner />
          </div>
        </div>
      )}
      <div className="px-12 py-8 max-md:px-4">
        <Breadcrumb
          items={[{ title: "خانه", link: "/" }, { title: "تسویه حساب" }]}
        />
        <h1 className="mb-8 text-[42px] font-bold max-md:text-[30px]">
          تسویه حساب
        </h1>
        {loading ? (
          <div className="grid h-[200px] w-full place-content-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="h-[250px]">
            <RetryError onRetry={() => checkoutHandler()} />
          </div>
        ) : (
          <div className="flex gap-8 max-[1100px]:flex-col-reverse">
            <div className="flex-[0.7]">
              <OrderSummary
                checkout={checkout}
                showProductsTable={showProductsTable}
                setShowProductsTable={setShowProductsTable}
                basket={basket}
                paymentFieldErrors={paymentFieldErrors}
              />
              <CheckoutForm
                checkout={checkout}
                shippings={shippings}
                shippingsLoading={shippingsLoading}
                shippingsError={shippingsError}
                shippingsMutate={shippingsMutate}
                checkoutHandler={checkoutHandler}
                paymentFieldErrors={paymentFieldErrors}
                setPaymentFieldErrors={setPaymentFieldErrors}
                couponRes={couponRes}
                setCouponRes={setCouponRes}
                basket={basket}
                gatewayName={gatewayName}
                setGatewayName={setGatewayName}
                selectedAddress={selectedAddress}
                onChangeAddress={() => {
                  setShowAddressOverlay(true);
                }}
              />
            </div>
            <div className="flex-[0.3]">
              <PriceSummary
                checkout={checkout}
                paymentError={paymentError}
                paymentFieldErrors={paymentFieldErrors}
                payLoading={payLoading}
                handlePayment={handlePayment}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
