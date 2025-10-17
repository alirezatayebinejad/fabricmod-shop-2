"use client";
import OtpStep from "@/app/auth/_components/OtpStep";
import PhoneStep from "@/app/auth/_components/PhoneStep";
import { useGlobalData } from "@/contexts/GlobalData";
import { AuthSteps } from "@/types/generalTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthCard() {
  const globalData = useGlobalData();
  const [step, setStep] = useState<AuthSteps>("login-phone");
  const router = useRouter();

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
        <Image
          src={
            globalData?.initials?.setting?.logo
              ? process.env.NEXT_PUBLIC_IMG_BASE +
                globalData.initials.setting.logo
              : "/images/imageplaceholder.png"
          }
          alt="fabricmod logo image"
          width={130}
          height={20}
          className="h-auth"
        />
      </div>
      {renderStep()}
      <div className="mt-5 cursor-pointer text-center">
        <p onClick={() => router.push("/")}>برگشت به خانه</p>
      </div>
    </div>
  );
}
