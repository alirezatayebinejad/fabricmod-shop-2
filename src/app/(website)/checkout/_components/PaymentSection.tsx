// _components/PaymentSection.tsx
import { Checkout } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import Image from "next/image";

interface PaymentSectionProps {
  gatewayName: string;
  setGatewayName: (gateway: string) => void;
  paymentFieldErrors: { [key: string]: string };
  setPaymentFieldErrors: (errors: any) => void;
  installment?: Checkout["installment"];
}

export default function PaymentSection({
  gatewayName,
  setGatewayName,
  paymentFieldErrors,
  setPaymentFieldErrors,
  installment,
}: PaymentSectionProps) {
  return (
    <div className="flex flex-wrap gap-20">
      <div>
        <h3 className="mb-5 mt-5 font-bold">درگاه پرداخت:</h3>
        <div className="flex flex-col flex-wrap items-start gap-4">
          {/* SEP Gateway */}
          <Button
            className="rounded-[5px] border-1 text-TextColor"
            style={
              gatewayName === "sep"
                ? {
                    backgroundColor: "var(--boxBg500)",
                    borderColor: "var(--primary)",
                  }
                : { backgroundColor: "var(--boxBg200)" }
            }
            startContent={
              <Image
                src={"/images/seplogo.png"}
                alt="sep logo"
                width={50}
                height={50}
              />
            }
            onPress={() => {
              setGatewayName("sep");
              if (paymentFieldErrors.gateway_name) {
                setPaymentFieldErrors((prev: any) => ({
                  ...prev,
                  gateway_name: "",
                }));
              }
            }}
          >
            سامان (سپ)
          </Button>
          {/* Torob Gateway */}
          {installment?.eligible && (
            <>
              <Button
                className="rounded-[5px] border-1 text-TextColor"
                style={
                  gatewayName === "torob"
                    ? {
                        backgroundColor: "var(--boxBg500)",
                        borderColor: "var(--primary)",
                      }
                    : { backgroundColor: "var(--boxBg200)" }
                }
                startContent={
                  <Image
                    src={"/images/toroblogo.svg"}
                    alt="torob logo"
                    width={30}
                    height={30}
                  />
                }
                onPress={() => {
                  setGatewayName("torob");
                  if (paymentFieldErrors.gateway_name) {
                    setPaymentFieldErrors((prev: any) => ({
                      ...prev,
                      gateway_name: "",
                    }));
                  }
                }}
              >
                پرداخت اقساطي ترب
              </Button>
              <div>
                <p>
                  {installment?.title_message} - {installment?.description}
                </p>
              </div>
            </>
          )}
        </div>
        {paymentFieldErrors.gateway_name && (
          <p className="mt-2 text-sm text-danger-600" data-payment-error>
            {paymentFieldErrors.gateway_name}
          </p>
        )}
      </div>
    </div>
  );
}
