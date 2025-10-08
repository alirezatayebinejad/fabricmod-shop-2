// _components/CouponSection.tsx
import { CheckCoupon } from "@/types/apiTypes";
import InputBasic from "@/components/inputs/InputBasic";
import { Button } from "@heroui/button";
import useMyForm from "@/hooks/useMyForm";
import apiCRUD from "@/services/apiCRUD";

interface CouponSectionProps {
  basket: any[];
  couponRes?: CheckCoupon;
  setCouponRes: (res?: CheckCoupon) => void;
  checkoutHandler: (
    refreshMode?: boolean,
    shippingMethod?: string,
    couponCode?: string,
    addressId?: number,
  ) => void;
  paymentFieldErrors: { [key: string]: string };
}

export default function CouponSection({
  basket,
  couponRes,
  setCouponRes,
  checkoutHandler,
  paymentFieldErrors,
}: CouponSectionProps) {
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

  return (
    <>
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
          کد تخفیف اعمال شده: {couponRes?.name}
        </p>
      )}
      {paymentFieldErrors.coupon && (
        <p className="mt-2 text-sm text-danger-600" data-payment-error>
          {paymentFieldErrors.coupon}
        </p>
      )}
    </>
  );
}
