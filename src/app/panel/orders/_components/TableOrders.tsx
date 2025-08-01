"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { OrderIndex, PaginateMeta } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import Edit from "@/components/svg/Edit";
import Eye from "@/components/svg/Eye";
import { Button } from "@heroui/button";
import StatusBadge from "@/components/datadisplay/StatusBadge";
import FormOrders from "@/app/panel/orders/_components/FormOrders";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import { currency } from "@/constants/staticValues";

export default function TableOrders() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/orders${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<OrderIndex>();
  const [orders, setOrders] = useState<OrderIndex[]>();

  useEffect(() => {
    if (data) {
      setPage(data.data?.meta?.current_page);
      setOrders(data.data?.orders);
    }
  }, [data]);

  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  const tableData: TableGenerateData = {
    headers: [
      { content: "کاربر" },
      { content: "مبلغ پرداختی" },
      { content: "وضعیت پرداخت" },
      { content: "وضعیت سفارش" },
      { content: <div></div> },
    ],
    body: orders?.map((order) => ({
      cells: [
        { data: <p>{order.user?.name}</p> },
        { data: <p>{order.paying_amount + " " + currency}</p> },
        {
          data: (
            <StatusBadge
              title={
                order.payment_status === "success"
                  ? "پرداخت موفق"
                  : order.payment_status === "pending"
                    ? "در حال انتظار"
                    : order.payment_status === "rejected"
                      ? "پرداخت ناموفق"
                      : "نامشخص"
              }
              mode={
                order.payment_status === "success"
                  ? "success"
                  : order.payment_status === "pending"
                    ? "pending"
                    : order.payment_status === "rejected"
                      ? "error"
                      : undefined
              }
            />
          ),
        },
        {
          data: (
            <p>
              {order.status === "pending"
                ? "در حال انتظار"
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
                          : order.status}
            </p>
          ),
        },
        {
          data: (
            <div className="flex min-w-[40px] justify-end gap-1">
              <Button
                isIconOnly
                size="sm"
                onClick={() => {
                  setSelectedData(order);
                  seeModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="ordersEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => {
                      setSelectedData(order);
                      editModal.onOpen();
                    }}
                    className="bg-boxBg300"
                  >
                    <Edit color="var(--TextColor)" />
                  </Button>
                }
              />
            </div>
          ),
        },
      ],
    })),
  };

  return (
    <>
      <TableGenerate
        data={tableData}
        stripedRows
        pagination={{ page, total: pages }}
        onPageChange={(page) => {
          setPage(page);
          changeFilters(`page=${page}`);
        }}
        loading={isLoading ? { columns: 5, rows: 5 } : undefined}
        error={error}
        onRetry={() => mutate()}
      />

      <ModalWrapper
        disclosures={{
          onOpen: editModal.onOpen,
          onOpenChange: editModal.onOpenChange,
          isOpen: editModal.isOpen,
        }}
        size="5xl"
        modalHeader={<h2>ویرایش سفارش</h2>}
        modalBody={
          <FormOrders
            onClose={() => editModal.onClose()}
            selectedData={selectedData}
          />
        }
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
          <FormOrders
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
          />
        }
      />
    </>
  );
}
