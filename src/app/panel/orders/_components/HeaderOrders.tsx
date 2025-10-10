"use client";

import FormOrders from "@/app/panel/orders/_components/FormOrders";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import { useFiltersContext } from "@/contexts/SearchFilters";
import apiCRUD from "@/services/apiCRUD";
import { ShippingmethodIndex } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { useState } from "react";

export default function HeaderOrders() {
  const { changeFilters, getFilterValue, deleteFilter } = useFiltersContext();
  const sortByFilterValue = getFilterValue("sortBy");
  const paymentFilterValue = getFilterValue("payment");
  const statusFilterValue = getFilterValue("status");
  const shippingMethodFilterValue = getFilterValue("shipping_method");
  const [shippingMethods, setShippingMethods] = useState<ShippingmethodIndex[]>(
    [],
  );
  const createModal = useDisclosure();

  const requestSelectOptions = async () => {
    const shippingData = await apiCRUD({
      urlSuffix: `admin-panel/shipping-methods`,
    });
    if (shippingData?.status === "success") {
      setShippingMethods(shippingData.data?.shipping_methods);
      return shippingData.data?.shipping_methods?.map(
        (item: ShippingmethodIndex) => ({
          id: item.id,
          title: item.name,
        }),
      );
    }
    return [];
  };

  return (
    <div className="mb-6 flex flex-col gap-5">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          {" "}
          <Button
            onPress={() => createModal.onOpen()}
            className="min-h-full !rounded-[5px] border-border"
            variant="bordered"
          >
            ساخت سفارش جديد
          </Button>
        </div>
        <ModalWrapper
          disclosures={{
            onOpen: createModal.onOpen,
            onOpenChange: createModal.onOpenChange,
            isOpen: createModal.isOpen,
          }}
          size="5xl"
          modalHeader={<h2>ساخت سفارش</h2>}
          modalBody={<FormOrders onClose={() => createModal.onClose()} />}
        />
      </div>

      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
        <SelectSearchCustom
          options={[
            { id: "max", title: "بیشترین" },
            { id: "min", title: "کمترین" },
            { id: "latest", title: "جدیدترین" },
            { id: "oldest", title: "قدیمی‌ترین" },
          ]}
          isSearchDisable
          title="انتخاب ترتیب"
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("sortBy=" + selected[0].id);
            } else {
              deleteFilter("sortBy");
            }
          }}
          defaultValue={
            sortByFilterValue
              ? [
                  {
                    id: sortByFilterValue,
                    title:
                      sortByFilterValue === "max"
                        ? "بیشترین"
                        : sortByFilterValue === "min"
                          ? "کمترین"
                          : sortByFilterValue === "latest"
                            ? "جدیدترین"
                            : sortByFilterValue === "oldest"
                              ? "قدیمی‌ترین"
                              : "",
                  },
                ]
              : undefined
          }
        />
        <SelectSearchCustom
          options={[
            { id: "pending", title: "در حال انتظار" },
            { id: "success", title: "پرداخت موفق" },
            { id: "rejected", title: "پرداخت ناموفق" },
          ]}
          title="وضعیت پرداخت"
          isSearchDisable
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("payment=" + selected[0].id);
            } else {
              deleteFilter("payment");
            }
          }}
          defaultValue={
            paymentFilterValue
              ? [
                  {
                    id: paymentFilterValue,
                    title:
                      paymentFilterValue === "pending"
                        ? "در حال انتظار"
                        : paymentFilterValue === "success"
                          ? "پرداخت موفق"
                          : paymentFilterValue === "rejected"
                            ? "پرداخت ناموفق"
                            : "",
                  },
                ]
              : undefined
          }
        />
        <SelectSearchCustom
          options={[
            { id: "pending", title: "در حال انتظار" },
            { id: "payout", title: "پرداخت" },
            { id: "prepare", title: "آماده سازی" },
            { id: "send", title: "ارسال" },
            { id: "end", title: "پایان" },
            { id: "cancel", title: "لغو" },
          ]}
          title="وضعیت سفارش"
          isSearchDisable
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("status=" + selected[0].id);
            } else {
              deleteFilter("status");
            }
          }}
          defaultValue={
            statusFilterValue
              ? [
                  {
                    id: statusFilterValue,
                    title:
                      statusFilterValue === "pending"
                        ? "در حال انتظار"
                        : statusFilterValue === "payout"
                          ? "پرداخت"
                          : statusFilterValue === "prepare"
                            ? "آماده سازی"
                            : statusFilterValue === "send"
                              ? "ارسال"
                              : statusFilterValue === "end"
                                ? "پایان"
                                : statusFilterValue === "cancel"
                                  ? "لغو"
                                  : "",
                  },
                ]
              : undefined
          }
        />
        <SelectSearchCustom
          requestSelectOptions={requestSelectOptions}
          isSearchDisable
          value={
            shippingMethodFilterValue
              ? [
                  {
                    id: shippingMethodFilterValue,
                    title:
                      shippingMethods?.find(
                        (c) => c.id.toString() === shippingMethodFilterValue,
                      )?.name || "",
                  },
                ]
              : []
          }
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("shipping_method=" + selected[0].id.toString());
            } else {
              deleteFilter("shipping_method");
            }
          }}
          title="روش ارسال"
        />
      </div>
    </div>
  );
}
