import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/inputs/input-otp";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { login } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import useCountdownTimer from "@/hooks/useCountDownTimer";
import useMyForm from "@/hooks/useMyForm";
import apiCRUD from "@/services/apiCRUD";
import { getCookie, setCookie } from "@/utils/cookieCRUD";
import { cookiesNames } from "@/constants/cacheNames";
import { AuthSteps } from "@/types/generalTypes";

type Props = {
  changeStep: (step: AuthSteps) => void;
};

export default function OtpStep({ changeStep }: Props) {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formattedTime, resetTimer, timerStatus } = useCountdownTimer(
    120,
    () => {},
    true,
  );

  const {
    setValues,
    values,
    errors,
    loading: formLoading,
    handleSubmit,
    setErrors,
  } = useMyForm(
    { otp: "" },
    async (formdata) => {
      const tempPhoneToken = getCookie(cookiesNames.tempPhoneToken);
      const res = await apiCRUD({
        urlSuffix: `auth/check-otp`,
        method: "POST",
        data: {
          login_token: tempPhoneToken,
          otp: formdata.otp,
        },
        noToast: true,
        requiresToken: false,
      });
      if (res?.status === "success") {
        login(res?.data);
        const fallbackUrl = searchParams.get("fallback") || "/";
        router.push(fallbackUrl);
        router.refresh();
      } else {
        if (typeof res?.message === "string") {
          toast.error(res?.message); // may be string or object of strings
        } else {
          setErrors(res?.message);
        }
      }
      setIsSubmitted(false); // Reset the flag after submission
    },
    {
      otp: [
        { required: true, message: "کد الزامیست" },
        { pattern: /^\d{5}$/, message: "کد 5 رقمی است" },
      ],
    },
  );

  const resendHandler = async () => {
    setLoading(true);
    if (timerStatus === "completed") {
      const tempPhoneToken = getCookie(cookiesNames.tempPhoneToken);

      const res = await apiCRUD({
        urlSuffix: `auth/resend-otp`,
        method: "POST",
        data: {
          login_token: tempPhoneToken,
        },
        requiresToken: false,
      });

      if (res?.status === "success") {
        setCookie(
          cookiesNames.tempPhoneToken,
          res?.data?.login_token || "",
          10,
        );
        resetTimer();
      } else {
        toast.error(res?.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (values.otp.length === 5 && !isSubmitted) {
      setIsSubmitted(true);
      (async () => {
        await handleSubmit();
        setValues((prev) => ({ ...prev, otp: "" }));
      })();
    }
  }, [values.otp, handleSubmit, isSubmitted, setValues]);

  return (
    <>
      <form noValidate onSubmit={handleSubmit}>
        <h1 className="mb-5 text-center text-TextSize500 font-bold">ورود</h1>
        <h2 className="text-[16px]">
          کد ارسال شده به شماره {searchParams.get("phone")} را وارد کنید
        </h2>
        <div dir="ltr" className="mt-[24px]">
          <InputOTP
            name="otp"
            maxLength={5}
            pattern={REGEXP_ONLY_DIGITS}
            value={values.otp}
            onChange={(val) => {
              setValues((prev) => ({ ...prev, otp: val }));
            }}
          >
            <InputOTPGroup className="w-full justify-between gap-[10px]">
              <InputOTPSlot
                index={0}
                className="h-[57px] flex-[0.2] !rounded-[10px] bg-boxBg400 text-[24px]"
              />
              <InputOTPSlot
                index={1}
                className="h-[57px] flex-[0.2] rounded-[10px] bg-boxBg400 text-[24px]"
              />
              <InputOTPSlot
                index={2}
                className="h-[57px] flex-[0.2] rounded-[10px] bg-boxBg400 text-[24px]"
              />
              <InputOTPSlot
                index={3}
                className="h-[57px] flex-[0.2] rounded-[10px] bg-boxBg400 text-[24px]"
              />
              <InputOTPSlot
                index={4}
                className="h-[57px] flex-[0.2] !rounded-[10px] bg-boxBg400 text-[24px]"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {errors.otp && (
          <p className="mt-2 text-center text-destructive-foreground">
            {errors.otp}
          </p>
        )}
        <div className="mt-[16px] flex items-center justify-between">
          <p
            onClick={() =>
              timerStatus !== "running" && !loading && resendHandler()
            }
            className={`${
              timerStatus === "running" || loading
                ? "text-textMute cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            ارسال مجدد کد
          </p>
          <p className="font-bold">{formattedTime}</p>
        </div>
        <div className="flex flex-col justify-center">
          <Button
            type="submit"
            isLoading={loading || formLoading}
            className="mt-[24px] rounded-[10px] bg-primary px-10 text-center text-[16px] font-[700] text-primary-foreground"
          >
            تایید
          </Button>
          <p
            onClick={() => changeStep("login-phone")}
            className="mt-4 cursor-pointer text-center text-TextSize300 font-[600]"
          >
            ورود مجدد
          </p>
        </div>
      </form>

      <div className="mt-[24px] text-center">
        <Link
          prefetch={false}
          href="/auth/login"
          className="text-TextSize300 text-TextColor"
        ></Link>
      </div>
    </>
  );
}
