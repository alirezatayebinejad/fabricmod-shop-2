import { useState } from "react";
import TableGenerate from "@/components/datadisplay/TableGenerate";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import apiCRUD from "@/services/apiCRUD";
import useSWR from "swr";
import { OrdersIndexSite } from "@/types/apiTypes";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { dateConvert } from "@/utils/dateConvert";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useDisclosure } from "@heroui/modal";
import ShowOrder from "@/app/(website)/dashboard/_components/Tabs/ShowOrder";
import { Button } from "@heroui/button";
import Eye from "@/components/svg/Eye";
import { currency } from "@/constants/staticValues";

export default function OrdersTab() {
  const { filters, changeFilters, deleteFilter } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `next/profile/orders${filters ? "?" + filters.replace(/&?tab=[^&]*/g, "") : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
  );

  const [selectedData, setSelectedData] = useState<
    OrdersIndexSite["orders"][number] | undefined
  >();
  const seeModal = useDisclosure();
  const orders: OrdersIndexSite = data?.data;

  return (
    <div className="w-full px-3 pb-12">
      <div className="inline-block">
        <div className="mb-5 flex gap-3 max-lg:flex-wrap">
          <SelectSearchCustom
            placeholder="وضعیت سفارش"
            isSearchDisable
            options={[
              { id: "pending", title: "در انتظار" },
              { id: "payout", title: "پرداخت" },
              { id: "prepare", title: "آماده سازی" },
              { id: "send", title: "ارسال" },
              { id: "end", title: "پایان" },
              { id: "cancel", title: "لغو" },
            ]}
            onChange={(selectedOption) => {
              if (selectedOption?.[0]?.id)
                changeFilters("status=" + selectedOption[0].id);
              else deleteFilter("status");
            }}
            classNames={{ base: "min-w-[150px]" }}
          />
          <SelectSearchCustom
            placeholder="وضعیت پرداخت"
            isSearchDisable
            options={[
              { id: "pending", title: "در انتظار" },
              { id: "success", title: "موفق" },
              { id: "rejected", title: "ناموفق" },
            ]}
            onChange={(selectedOption) => {
              if (selectedOption?.[0]?.id)
                changeFilters("payment_status=" + selectedOption[0].id);
              else deleteFilter("payment_status");
            }}
            classNames={{ base: "min-w-[150px]" }}
          />
          <SelectSearchCustom
            placeholder="مرتب سازی"
            isSearchDisable
            options={[
              { id: "max", title: "بیشترین" },
              { id: "min", title: "کمترین" },
              { id: "latest", title: "جدیدترین" },
              { id: "oldest", title: "قدیمی‌ترین" },
            ]}
            onChange={(selectedOption) => {
              if (selectedOption?.[0]?.id)
                changeFilters("sortBy=" + selectedOption[0].id);
              else deleteFilter("sortBy");
            }}
            classNames={{ base: "min-w-[150px]" }}
          />
        </div>
      </div>

      <TableGenerate
        stripedRows
        pagination={{
          page: orders?.meta.current_page,
          total: orders?.meta.last_page,
        }}
        onPageChange={(page) => {
          changeFilters(`page=${page}`);
        }}
        loading={isLoading ? { columns: 7, rows: 5 } : undefined}
        error={error}
        onRetry={() => mutate()}
        data={{
          headers: [
            { content: "تعداد" },
            { content: "مبلغ پرداختی" },
            { content: "وضعیت پرداخت" },
            { content: "وضعیت سفارش" },
            { content: "ایجاد" },
            { content: "آپدیت" },
            { content: "" },
          ],
          body: orders?.orders.map((order) => ({
            cells: [
              { data: order.items_count },
              { data: order.paying_amount.toLocaleString() + " " + currency },
              {
                data: (
                  <p
                    className={
                      order.payment_status === "success"
                        ? "text-successForeground"
                        : order.payment_status === "rejected"
                          ? "text-failureForeground"
                          : "text-pendingForeground"
                    }
                  >
                    {order.payment_status === "success"
                      ? "موفق"
                      : order.payment_status === "rejected"
                        ? "ناموفق"
                        : order.payment_status === "pending"
                          ? "در انتظار"
                          : "نا مشخص"}
                  </p>
                ),
              },
              {
                data: (
                  <p>
                    {order.status === "pending"
                      ? "در انتظار"
                      : order.status === "payout"
                        ? "پرداخت"
                        : order.status === "prepare"
                          ? "آماده سازی"
                          : order.status === "send"
                            ? "ارسال"
                            : order.status === "end"
                              ? "پایان"
                              : order.status === "cancel"
                                ? "لغو"
                                : "نا مشخص"}
                  </p>
                ),
              },
              { data: dateConvert(order.created_at, "persian") },
              { data: dateConvert(order.updated_at, "persian") },
              {
                data: (
                  <div className="flex min-w-[40px] justify-end gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      onPress={() => {
                        setSelectedData(order);
                        seeModal.onOpen();
                      }}
                      className="bg-boxBg300"
                    >
                      <Eye color="var(--TextColor)" />
                    </Button>
                  </div>
                ),
              },
            ],
          })),
        }}
      />
      <ModalWrapper
        disclosures={{
          onOpen: seeModal.onOpen,
          onOpenChange: seeModal.onOpenChange,
          isOpen: seeModal.isOpen,
        }}
        size="5xl"
        modalHeader={<h2>مشاهده سفارش</h2>}
        modalBody={
          <ShowOrder
            onClose={() => seeModal.onClose()}
            selectedData={selectedData}
          />
        }
      />
    </div>
  );
}
