// _components/PaymentSection.tsx
import { Button } from "@heroui/button";
import Image from "next/image";

interface PaymentSectionProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  gatewayName: string;
  setGatewayName: (gateway: string) => void;
  paymentFieldErrors: { [key: string]: string };
  setPaymentFieldErrors: (errors: any) => void;
}

export default function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  gatewayName,
  setGatewayName,
  paymentFieldErrors,
  setPaymentFieldErrors,
}: PaymentSectionProps) {
  return (
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
                setPaymentFieldErrors((prev: any) => ({
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
          <p className="mt-2 text-sm text-danger-600" data-payment-error>
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
