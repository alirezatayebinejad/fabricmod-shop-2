"use client";
import { login } from "@/services/auth";
import { AuthSteps } from "@/types/generalTypes";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Eye, EyeOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useMyForm from "@/hooks/useMyForm";
import apiCRUD from "@/services/apiCRUD";
import { setCookie } from "@/utils/cookieCRUD";
import { cookiesNames } from "@/constants/cacheNames";

type Props = {
  changeStep: (step: AuthSteps) => void;
  isForgotPass?: boolean;
};

export default function PhoneStep({ changeStep, isForgotPass = false }: Props) {
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isWithPass, setIsWithPass] = useState(false);
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (isForgotPass) setIsWithPass(false);
  }, [isForgotPass]);

  const { setValues, values, errors, loading, handleSubmit, setErrors } =
    useMyForm(
      { cellphone: "", password: "" },
      async (formData) => {
        const res = await apiCRUD({
          urlSuffix: isForgotPass
            ? "auth/forget-pass"
            : isWithPass
              ? `auth/login-pass`
              : `auth/login`,
          method: "POST",
          data: {
            ...(isForgotPass
              ? { forget_param: "0" + formData.cellphone }
              : isWithPass
                ? {
                    cellphone: "0" + formData.cellphone,
                    password: formData.password,
                  }
                : { cellphone: "0" + formData.cellphone }),
          },
          requiresToken: false,
        });

        if (res?.status === "success") {
          if (isWithPass) {
            login(res?.data);
            const fallbackUrl = currentSearchParams.get("fallback") || "/";
            router.push(fallbackUrl);
            router.refresh();
          } else {
            if (isForgotPass) {
              changeStep("login-phone");
              setIsWithPass(true);
            } else {
              const updatedSearchParams = new URLSearchParams(
                currentSearchParams.toString(),
              );
              updatedSearchParams.set("phone", formData.cellphone);
              router.push(pathname + "?" + updatedSearchParams.toString());

              setCookie(cookiesNames.tempPhoneToken, res.data?.login_token, 1);
              changeStep("login-otp");
            }
          }
        }
        setErrors(res.message);
      },
      {
        ...(isWithPass
          ? {
              cellphone: [{ required: true, message: "شماره تلفن الزامی است" }],
              password: [{ required: true, message: "رمز عبور الزامی است" }],
            }
          : {
              cellphone: [
                {
                  required: true,
                  message: "شماره تلفن الزامیست",
                },
                {
                  pattern: /^\d{10}$/,
                  message: "شماره تلفن بدون صفر و ده رقمی میباشد",
                },
              ],
            }),
      },
    );

  return (
    <>
      <h1 className="mb-5 text-center text-TextSize500 font-bold">ورود</h1>
      {isForgotPass && (
        <h2 className="mb-5 text-TextSize400">
          جهت بازیابی رمز عبور خود شماره موبایل خود را وارد کنید
        </h2>
      )}
      <form noValidate onSubmit={handleSubmit} className="ltr">
        {!isWithPass && (
          <>
            <label htmlFor="cellphone" className="text-[16px]">
              شماره موبایل
            </label>
            <div className="mt-[8px] flex items-center justify-center rounded-[10px] border-[1px] border-transparent bg-boxBg250 focus-within:border-primary">
              <input
                dir="ltr"
                name="cellphone"
                type="number"
                onWheel={(e) => (e.target as HTMLElement).blur()}
                id="cellphone"
                className="h-[48px] w-5 flex-1 bg-transparent px-5 text-left focus:outline-none"
                value={values.cellphone}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    cellphone: e.target.value,
                  }))
                }
              />
              <div className="flex h-[48px] w-[52px] items-center justify-center border-r-1 border-boxBg100 text-[16px]">
                <p>98+</p>
              </div>
            </div>
            {errors.cellphone && (
              <p className="text-destructive-foreground">{errors.cellphone}</p>
            )}
          </>
        )}
        {isWithPass && (
          <>
            <div className="mt-10">
              <>
                <label htmlFor="cellphone" className="text-[16px]">
                  شماره موبایل
                </label>
                <div className="mt-[8px] flex items-center justify-center rounded-[10px] border-[1px] border-transparent bg-boxBg250 focus-within:border-primary">
                  <input
                    dir="ltr"
                    name="cellphone"
                    type="number"
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                    id="cellphone"
                    className="h-[48px] w-5 flex-1 bg-transparent px-5 text-left focus:outline-none"
                    value={values.cellphone}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        cellphone: e.target.value,
                      }))
                    }
                  />
                  <div className="flex h-[48px] w-[52px] items-center justify-center border-r-1 border-boxBg100 text-[16px]">
                    <p>98+</p>
                  </div>
                </div>
                {errors.cellphone && (
                  <p className="text-destructive-foreground">
                    {errors.cellphone}
                  </p>
                )}
              </>
            </div>
            <div className="mt-10" dir="ltr">
              <Input
                name="password"
                label="رمز عبور"
                variant="bordered"
                labelPlacement="outside"
                placeholder=" "
                startContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsPassVisible((prev) => !prev)}
                  >
                    {isPassVisible ? (
                      <EyeOff className="w-[16px] text-TextColor" />
                    ) : (
                      <Eye className="w-[16px] text-TextColor" />
                    )}
                  </button>
                }
                type={isPassVisible ? "text" : "password"}
                value={values.password}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, password: e.target.value }))
                }
                classNames={{
                  label:
                    "w-full pe-0 text-right text-[16px] !text-TextColor !bottom-[-8px]",
                  input: "text-left !px-6 text-TextColor",
                  inputWrapper:
                    "h-[48px] rounded-[10px] border-1 focus-within:!border-primary border-transparent bg-boxBg250",
                }}
              />
              {errors.password && (
                <p className="text-right text-destructive-foreground">
                  {errors.password}
                </p>
              )}
              {/*  {!isForgotPass && (
                <p
                  onClick={() => changeStep("login-forgotpass")}
                  className="mt-2 cursor-pointer text-start text-TextSize300 font-[600]"
                >
                  فراموشی رمز عبور
                </p>
              )} */}
            </div>
          </>
        )}
        <div className="mt-[24px] flex items-center justify-center gap-2">
          <Button
            type="submit"
            isLoading={loading}
            className="rounded-[10px] bg-primary px-10 text-center text-[16px] font-[700] text-primary-foreground"
          >
            ارسال
          </Button>
        </div>
        {isWithPass ? (
          <p
            onClick={() => setIsWithPass(false)}
            className="mt-4 cursor-pointer text-center text-TextSize300 font-[600]"
          >
            ورود از طریق کد یک بار مصرف
          </p>
        ) : isForgotPass ? (
          <p
            onClick={() => {
              changeStep("login-phone");
              setIsWithPass(true);
            }}
            className="mt-4 cursor-pointer text-center text-TextSize300 font-[600]"
          >
            ورود
          </p>
        ) : /* (
          <p
            onClick={() => setIsWithPass(true)}
            className="mt-4 cursor-pointer text-center text-TextSize300 font-[600]"
          >
            ورود با رمز عبور
          </p>
        ) */ null}
      </form>
    </>
  );
}
