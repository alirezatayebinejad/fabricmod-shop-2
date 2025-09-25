"use client";
import Breadcrumb from "@/components/datadisplay/Breadcrumb";
import TableGenerate from "@/components/datadisplay/TableGenerate";
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
import { currency, weight } from "@/constants/staticValues";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PayMethods from "@/app/(website)/checkout/_components/PayMethods";
import formatPrice from "@/utils/formatPrice";
import useSWR from "swr";
import InputBasic from "@/components/inputs/InputBasic";
import { Button } from "@heroui/button";
import useMyForm from "@/hooks/useMyForm";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import AddressForm from "@/app/(website)/dashboard/_components/Tabs/AddressForm";

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
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [gatewayName, setGatewayName] = useState("sep");

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

  const checkoutHandler = async (
    refreshMode = false,
    shippingMethod?: string,
    couponCode = undefined as string | undefined,
    addressId?: number,
  ) => {
    setError(undefined);
    if (refreshMode) setRefreshing(true);
    else setLoading(true);

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

    const paymentData = {
      shipping_method: checkout.selected_shipping_method?.code,
      address_id: checkout.selected_address?.id,
      coupon: couponRes?.code,
      products: basket?.map((p) => ({
        product_id: p.id,
        qty: p.countBasket,
        variation_id: p.selectedVariationId,
      })),
      payment_method: paymentMethod,
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
      // Handle field-specific errors
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

  const couponForm = useMyForm(
    {
      code: "",
    },
    async (formData) => {
      const res = await apiCRUD({
        urlSuffix: `next/cart/check-coupon`,
        method: "POST",
        data: formData,
      });
      if (res?.message) couponForm.setErrors(res.message);
      if (res?.status === "success") {
        setCouponRes(res.data);
        checkoutHandler(true, undefined, formData.code);
      } else {
        setCouponRes(undefined);
      }
    },
  );

  useEffect(() => {
    if (error) {
      router.push(`/cart?errors=${error}`);
    }
  }, [error, router]);

  useEffect(() => {
    // Wait for basket context to be mounted before checking basket
    if (!isMounted) return;

    if (basket?.length > 0) {
      checkoutHandler();
    } else {
      router.push("/cart");
    }
    // eslint-disable-next-line
  }, [isMounted, basket]);

  useEffect(() => {
    if (scrollToError) {
      // Find the first error element and scroll to it
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
            <RetryError
              onRetry={() => {
                checkoutHandler();
              }}
            />
          </div>
        ) : (
          <div className="flex gap-8 max-[1100px]:flex-col-reverse">
            <div className="flex-[0.7]">
              <h2 className="mb-5 font-bold">سفارش شما</h2>
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
                            className={
                              "z-0 object-cover transition-transform duration-400 group-hover:scale-110"
                            }
                          />
                        ),
                      },
                      { data: item.product.name },
                      {
                        data: (
                          <p>
                            {item.variation.attribute.name +
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
              {paymentFieldErrors.products && (
                <p className="mt-2 text-sm text-danger-600" data-payment-error>
                  {paymentFieldErrors.products}
                </p>
              )}
              <div className="mt-5 flex flex-col gap-5">
                <h2 className="font-bold">آدرس شما:</h2>
                <div className="flex gap-1 focus-within:border-b-TextColor max-sm:flex-col">
                  {addressLoading ? (
                    <div className="grid h-[200px] w-full place-content-center">
                      <Spinner />
                    </div>
                  ) : addressError ? (
                    <div className="h-[250px]">
                      <RetryError
                        onRetry={() => {
                          addressMutate();
                        }}
                      />
                    </div>
                  ) : (
                    checkout?.selected_address &&
                    addresses && (
                      <SelectSearchCustom
                        options={addresses.map((a) => ({
                          id: a.id,
                          title: a.title,
                          description: a.address,
                        }))}
                        defaultValue={[
                          {
                            id: checkout.selected_address.id,
                            title: checkout.selected_address.title,
                            description: checkout.selected_address.address,
                          },
                        ]}
                        isSearchDisable
                        showNoOneOption={false}
                        onChange={(val) => {
                          if (val?.[0]) {
                            checkoutHandler(
                              true,
                              undefined,
                              undefined,
                              parseInt(val[0].id.toString()),
                            );
                            if (paymentFieldErrors.address_id) {
                              setPaymentFieldErrors((prev) => ({
                                ...prev,
                                address_id: "",
                              }));
                            }
                          }
                        }}
                      />
                    )
                  )}
                  <div>
                    <Button
                      onPress={() => setIsFormModalOpen(true)}
                      className="min-h-full !rounded-[5px] border-border"
                      variant="bordered"
                    >
                      ساخت آدرس جديد
                    </Button>
                  </div>
                </div>
                {paymentFieldErrors.address_id && (
                  <p
                    className="mt-2 text-sm text-danger-600"
                    data-payment-error
                  >
                    {paymentFieldErrors.address_id}
                  </p>
                )}
                <ModalWrapper
                  disclosures={{
                    isOpen: isFormModalOpen,
                    onOpenChange: () => {
                      setIsFormModalOpen(false);
                    },
                  }}
                  size="5xl"
                  modalHeader={<h2>افزودن آدرس جدید</h2>}
                  isDismissable={true}
                  modalBody={
                    <AddressForm
                      onClose={() => setIsFormModalOpen(false)}
                      isEditMode={false}
                      onSuccess={() => {
                        addressMutate();
                      }}
                    />
                  }
                />
                <div className="flex gap-1 focus-within:border-b-TextColor">
                  <InputBasic
                    name="coupon"
                    placeholder="کد تخفیف"
                    onChange={couponForm.handleChange("code")}
                    value={couponForm.values.code}
                    errorMessage={couponForm.errors.code}
                    classNames={{ inputWrapper: "border-none rounded-none" }}
                  />
                  <Button
                    isDisabled={basket?.length < 1}
                    onPress={() => couponForm.handleSubmit()}
                    className="bg-transparent hover:text-primary"
                  >
                    اعمال کد
                  </Button>
                </div>
                {couponRes && (
                  <p className="mt-2 text-success-foreground">
                    کد تخفیف اعمال شده: {couponRes.name}
                  </p>
                )}
                {paymentFieldErrors.coupon && (
                  <p
                    className="mt-2 text-sm text-danger-600"
                    data-payment-error
                  >
                    {paymentFieldErrors.coupon}
                  </p>
                )}
                <h3 className="mb-2 mt-5 font-bold">روش ارسال:</h3>

                {shippingsLoading ? (
                  <div className="grid h-[200px] w-full place-content-center">
                    <Spinner />
                  </div>
                ) : shippingsError ? (
                  <div className="h-[250px]">
                    <RetryError
                      onRetry={() => {
                        shippingsMutate();
                      }}
                    />
                  </div>
                ) : (
                  <PayMethods
                    data={shippings}
                    selectedMethodCode={
                      checkout?.selected_shipping_method?.code
                    }
                    onChange={(name) => {
                      checkoutHandler(true, name);
                      if (paymentFieldErrors.shipping_method) {
                        setPaymentFieldErrors((prev) => ({
                          ...prev,
                          shipping_method: "",
                        }));
                      }
                    }}
                  />
                )}
                {paymentFieldErrors.shipping_method && (
                  <p
                    className="mt-2 text-sm text-danger-600"
                    data-payment-error
                  >
                    {paymentFieldErrors.shipping_method}
                  </p>
                )}
                <div className="flex flex-wrap gap-20">
                  <div>
                    <h3 className="mb-5 mt-5 font-bold">روش پرداخت:</h3>
                    <div>
                      <Button
                        className="rounded-[5px] text-TextColor"
                        style={
                          paymentMethod === "online"
                            ? { backgroundColor: "var(--boxBg500)" }
                            : { backgroundColor: "var(--boxBg200)" }
                        }
                        onPress={() => {
                          setPaymentMethod("online");
                          if (paymentFieldErrors.payment_method) {
                            setPaymentFieldErrors((prev) => ({
                              ...prev,
                              payment_method: "",
                            }));
                          }
                        }}
                      >
                        آنلاین
                      </Button>
                    </div>
                    {paymentFieldErrors.payment_method && (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        data-payment-error
                      >
                        {paymentFieldErrors.payment_method}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-5 mt-5 font-bold">درگاه پرداخت:</h3>
                    <div>
                      <Button
                        className="rounded-[5px] text-TextColor"
                        style={
                          gatewayName === "sep"
                            ? { backgroundColor: "var(--boxBg500)" }
                            : { backgroundColor: "var(--boxBg200)" }
                        }
                        onPress={() => {
                          setGatewayName("sep");
                          if (paymentFieldErrors.gateway_name) {
                            setPaymentFieldErrors((prev) => ({
                              ...prev,
                              gateway_name: "",
                            }));
                          }
                        }}
                      >
                        سامان (سپ)
                      </Button>
                    </div>
                    {paymentFieldErrors.gateway_name && (
                      <p
                        className="mt-2 text-sm text-danger-600"
                        data-payment-error
                      >
                        {paymentFieldErrors.gateway_name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-[0.3]">
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
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
