"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import formatPrice from "@/utils/formatPrice";
import { currency } from "@/constants/staticValues";
import { useBasket } from "@/contexts/BasketContext";

export default function PaymentResultPage() {
  const { removeAllBasket } = useBasket();
  const searchParams = useSearchParams();

  const success = searchParams.get("success") === "true";
  const msg = searchParams.get("msg");

  // جزئیات تراکنش
  const orderId = searchParams.get("order_id");
  const amount = searchParams.get("amount");
  const gatewayParam = searchParams.get("gateway");
  const gatewayMap: Record<string, string> = {
    sep: "درگاه سپ",
    torob: "ترب",
  };
  const gateway = gatewayParam
    ? gatewayMap[gatewayParam] || gatewayParam
    : null;
  const refId = searchParams.get("ref_id");

  useEffect(() => {
    if (success) removeAllBasket();
    //eslint-disable-next-line
  }, [success]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-boxBg200 p-8">
        <h1 className="mb-8 text-center text-2xl font-bold text-TextColor">
          نتیجه پرداخت
        </h1>

        <div className="flex flex-col items-center justify-center space-y-6">
          {success ? (
            <>
              <CheckCircle className="h-20 w-20 text-success-foreground" />
              <h2 className="text-2xl font-bold text-success-foreground">
                پرداخت موفق بود!
              </h2>
              <p className="text-center text-TextColor">
                {msg ? decodeURIComponent(msg) : "پرداخت با موفقیت انجام شد."}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-destructive-foreground">
                پرداخت ناموفق بود
              </h2>
              <p className="text-center text-TextColor">
                {msg ? decodeURIComponent(msg) : "پرداخت شما ناموفق بود."}
              </p>
            </>
          )}
        </div>

        {/* جزئیات تراکنش */}
        {(orderId || amount || refId) && (
          <div className="mt-8 rounded-lg border border-border bg-white/50 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-TextColor">
              جزئیات تراکنش
            </h3>
            <div className="space-y-3">
              {orderId && (
                <div className="flex justify-between">
                  <p className="text-TextColor">شماره سفارش:</p>
                  <p className="font-mono font-semibold">#{orderId}</p>
                </div>
              )}
              {amount && (
                <div className="flex justify-between">
                  <p className="text-TextColor">مبلغ:</p>
                  <p className="text-lg font-bold">
                    {formatPrice(Number(amount))} {currency}
                  </p>
                </div>
              )}
              {refId && (
                <div className="flex justify-between">
                  <p className="text-TextColor">کد پیگیری:</p>
                  <p className="font-mono text-sm">{refId}</p>
                </div>
              )}
              {gateway && (
                <div className="flex justify-between">
                  <p className="text-TextColor">درگاه پرداخت:</p>
                  <p className="font-semibold">{gateway}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* دکمه‌ها */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-primary px-6 py-3 text-center font-bold text-primary-foreground transition"
          >
            بازگشت به خانه
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-border bg-boxBg300 px-6 py-3 text-center font-bold text-TextColor transition"
          >
            پنل کاربری
          </Link>
        </div>
      </section>
    </main>
  );
}
