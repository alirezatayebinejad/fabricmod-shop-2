"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import apiCRUD from "@/services/apiCRUD";
import { PaymentVerify } from "@/types/apiTypes";
import formatPrice from "@/utils/formatPrice";
import { dateConvert } from "@/utils/dateConvert";
import { currency } from "@/constants/staticValues";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { useBasket } from "@/contexts/BasketContext";

export default function PaymentResultPage() {
  const { removeAllBasket } = useBasket();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentVerify | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | object | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      // Get all search parameters
      const allParams = new URLSearchParams(searchParams.toString());

      if (allParams.toString() === "") {
        setError("اطلاعات پرداخت ناقص است.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiCRUD({
          urlSuffix: `next/cart/payment-verify?${allParams.toString()}`,
          method: "POST",
          noToast: true,
        });

        if (response?.status === "success") {
          setPaymentData(response.data);
          removeAllBasket();
        } else {
          setError(response?.message || "خطا در تایید پرداخت");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError("خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
          <p className="mt-4 text-lg text-TextColor">در حال تایید پرداخت...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-16 w-16 text-destructive-foreground" />
          <h2 className="mt-4 text-xl font-bold text-destructive-foreground">
            خطا در پرداخت
          </h2>
          <p className="mt-2 text-center text-TextColor">
            {typeof error === "string" ? error : "مشکل در پرداخت"}
          </p>
        </div>
      );
    }

    if (!paymentData) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-16 w-16 text-primary" />
          <h2 className="mt-4 text-xl font-bold text-primary">
            اطلاعات پرداخت یافت نشد
          </h2>
        </div>
      );
    }

    const isSuccess =
      paymentData.success === "success" || searchParams.get("Status") === "OK";
    const transaction = paymentData.transaction;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center">
          {isSuccess ? (
            <CheckCircle className="h-20 w-20 text-success-foreground" />
          ) : (
            <XCircle className="h-20 w-20 text-destructive-foreground" />
          )}
          <h2
            className={`mt-4 text-2xl font-bold ${isSuccess ? "text-success-foreground" : "text-destructive-foreground"}`}
          >
            {isSuccess ? "پرداخت موفق بود!" : "پرداخت ناموفق بود"}
          </h2>
        </div>

        {/* Payment Details */}
        <div className="rounded-lg p-6">
          <h3 className="mb-4 text-lg font-semibold text-TextColor">
            جزئیات تراکنش
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-TextColor">شماره سفارش:</p>
              <p className="font-mono font-semibold">#{transaction.order_id}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-TextColor">مبلغ:</p>
              <p className="text-lg font-bold">
                {formatPrice(transaction.amount)} {currency}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-TextColor">کد پیگیری:</p>
              <p className="font-mono text-sm">{transaction.ref_id}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-TextColor">درگاه پرداخت:</p>
              <p className="font-semibold">{transaction.gateway_name}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-TextColor">وضعیت:</p>
              <p
                className={`font-semibold ${isSuccess ? "text-success-foreground" : "text-destructive-foreground"}`}
              >
                {isSuccess ? "موفق" : "ناموفق"}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-TextColor">تاریخ:</p>
              <p className="text-sm">
                {dateConvert(transaction.created_at, "persian", "english")}
              </p>
            </div>
            {transaction.description && (
              <div className="flex justify-between">
                <p className="text-TextColor">توضیحات:</p>
                <p className="max-w-xs text-right text-sm">
                  {transaction.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="rounded-lg border border-border bg-success p-4">
            <p className="text-center text-success-foreground">
              سفارش شما با موفقیت ثبت شد. کد پیگیری شما:{" "}
              <span className="font-mono font-bold">{transaction.ref_id}</span>
            </p>
          </div>
        )}

        {/* Error Message */}
        {!isSuccess && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-center text-red-800">
              متأسفانه پرداخت شما ناموفق بود. لطفاً دوباره تلاش کنید.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border-1 border-border bg-boxBg200 p-8">
        <h1 className="mb-8 text-center text-2xl font-bold text-TextColor">
          نتیجه پرداخت
        </h1>

        {renderContent()}

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
