"use client";
import OtpStep from "@/app/auth/_components/OtpStep";
import PhoneStep from "@/app/auth/_components/PhoneStep";
import { useGlobalData } from "@/contexts/GlobalData";
import { AuthSteps } from "@/types/generalTypes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AuthCard() {
  const globalData = useGlobalData();
  const [step, setStep] = useState<AuthSteps>("login-phone");

  const renderStep = () => {
    switch (step) {
      case "login-phone":
        return <PhoneStep changeStep={(step: AuthSteps) => setStep(step)} />;
      case "login-forgotpass":
        return (
          <PhoneStep
            changeStep={(step: AuthSteps) => setStep(step)}
            isForgotPass={true}
          />
        );
      case "login-otp":
        return <OtpStep changeStep={(step: AuthSteps) => setStep(step)} />;
    }
  };

  return (
    <div className="w-full max-w-[461px] rounded-[16px] bg-boxBg100 p-[24px]">
      <div className="flex justify-center p-12">
        <Link href={"/"} prefetch={false}>
          <Image
            src={
              globalData?.initials?.setting?.logo
                ? process.env.NEXT_PUBLIC_IMG_BASE +
                  globalData.initials.setting.logo
                : "/images/imageplaceholder.png"
            }
            alt="logo image"
            width={130}
            height={20}
            className="h-auth"
          />
        </Link>
      </div>
      {renderStep()}
      <Link href={"/"} className="mt-5 flex justify-center" prefetch={false}>
        <p>برگشت به خانه</p>
      </Link>
    </div>
  );
}
