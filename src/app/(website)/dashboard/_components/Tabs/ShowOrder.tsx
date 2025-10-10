import apiCRUD from "@/services/apiCRUD";
import { OrderShowSite, OrdersIndexSite } from "@/types/apiTypes";
import React from "react";
import useSWR from "swr";
import TableGenerate from "@/components/datadisplay/TableGenerate";
import { dateConvert } from "@/utils/dateConvert";
import { Button } from "@heroui/button";
import Image from "next/image";
import { currency, weight } from "@/constants/staticValues";

type Props = {
  onClose: () => void;
  selectedData?: OrdersIndexSite["orders"][number];
};

export default function ShowOrder({ onClose, selectedData }: Props) {
  const { data, error, isLoading } = useSWR(
    `next/profile/orders/` + selectedData?.id,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );
  const order: OrderShowSite = data?.data;

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در بارگذاری اطلاعات</div>;

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <div className="rounded-md bg-boxBg200 p-4">
          <p>
            <strong>شناسه سفارش:</strong> {order.id}
          </p>
          <p>
            <strong>وضعیت پرداخت:</strong>{" "}
            {order.payment_status === "success"
              ? "موفق"
              : order.payment_status === "pending"
                ? "در انتظار"
                : "ناموفق"}
          </p>
          <p>
            <strong>وضعیت سفارش:</strong>{" "}
            {order.status === "pending"
              ? "در انتظار"
              : order.status === "payout"
                ? "پرداخت"
                : order.status === "prepare"
                  ? "آماده سازی"
                  : order.status === "send"
                    ? "ارسال"
                    : order.status === "end"
                      ? "تکميل"
                      : "لغو"}
          </p>
          <p>
            <strong>تاریخ ایجاد:</strong>{" "}
            {dateConvert(order.created_at, "persian")}
          </p>
          <p>
            <strong>تاریخ بروزرسانی:</strong>{" "}
            {dateConvert(order.updated_at, "persian")}
          </p>
          <p>
            <strong>شماره تحویل:</strong> {order.delivery_serial}
          </p>
        </div>
        <div className="rounded-md bg-boxBg200 p-4">
          <p>
            <strong>مبلغ کل:</strong>{" "}
            {order.total_amount.toLocaleString() + " " + currency}
          </p>
          <p>
            <strong>مبلغ پرداختی:</strong>{" "}
            {order.paying_amount.toLocaleString() + " " + currency}
          </p>
          <p>
            <strong>مبلغ تحویل:</strong>{" "}
            {order.delivery_amount.toLocaleString() + " " + currency}
          </p>
          <p>
            <strong>مبلغ کد تخفيف:</strong>{" "}
            {order.coupon_amount.toLocaleString() + " " + currency}
          </p>
          <p>
            <strong>وزن کل:</strong> {order.total_weight + " " + weight}
          </p>
          <p>
            <strong>توضیحات:</strong> {order.description}
          </p>
        </div>
      </div>
      <h3 className="mb-4 text-2xl font-bold">آیتم‌های سفارش</h3>
      <TableGenerate
        data={{
          headers: [
            { content: "تصویر محصول" },
            { content: "نام محصول" },
            { content: "نوع" },
            { content: "قیمت" },
            { content: "تعداد" },
            { content: "مجموع" },
          ],
          body: order.items.map((item) => ({
            cells: [
              {
                data: (
                  <div className="w-[90px]">
                    <Image
                      src={
                        item.product?.primary_image
                          ? process.env.NEXT_PUBLIC_IMG_BASE +
                            item.product.primary_image
                          : "/images/imageplaceholder.png"
                      }
                      alt={item.product?.name || "نام محصول"}
                      width={90}
                      height={90}
                      className="h-auto w-full rounded-md"
                    />
                  </div>
                ),
              },
              { data: item.product?.name || "-" },
              {
                data:
                  item.variation?.attribute.name + ": " + item.variation?.value,
              },
              { data: item.price?.toLocaleString() },
              { data: item.quantity },
              { data: (item.price * item.quantity).toLocaleString() },
            ],
          })),
        }}
      />
      <h3 className="mb-4 mt-6 text-2xl font-bold">آدرس تحویل</h3>
      <div className="mb-6 rounded-md bg-gray-100 p-4">
        <p>
          <strong>گیرنده:</strong> {order.address.receiver_name}
        </p>
        <p>
          <strong>شماره تماس:</strong> {order.address.cellphone}
        </p>
        <p>
          <strong>کد پستی:</strong> {order.address.postal_code || "نامشخص"}
        </p>
        <p>
          <strong>استان:</strong> {order.address.province_id}
        </p>
        <p>
          <strong>شهر:</strong> {order.address.city_id}
        </p>
        <p>
          <strong>آدرس:</strong> {order.address.address}
        </p>
      </div>
      <h3 className="mb-4 text-2xl font-bold">روش ارسال</h3>
      <div className="rounded-md bg-gray-100 p-4">
        <p>
          <strong>نام روش:</strong> {order.shipping.name}
        </p>
      </div>
      <div className="mt-6 text-center">
        <Button onClick={onClose}>بستن</Button>
      </div>
    </div>
  );
}
