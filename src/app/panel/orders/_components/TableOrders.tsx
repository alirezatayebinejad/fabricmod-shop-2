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
import FormTransactions from "@/app/panel/transactions/_components/FormTransactions";
import formatPrice from "@/utils/formatPrice";
import { dateConvert } from "@/utils/dateConvert";

export default function TableOrders() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/orders${filters ? "?" + filters : "?"}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();
  const transactionsModal = useDisclosure();

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
      { content: "دریافت کننده" },
      { content: "مبلغ پرداختی" },
      { content: "ایجاد" },
      { content: "آپدیت" },
      { content: "وضعیت پرداخت" },
      { content: "وضعیت سفارش" },
      { content: <div></div> },
    ],
    body: orders?.map((order) => ({
      cells: [
        {
          data: (
            <p>
              {order.user.cellphone}
              <br />
              {order.user?.name ?? ""}
            </p>
          ),
        },
        { data: <p>{formatPrice(+order.paying_amount) + " " + currency}</p> },
        {
          data: (
            <p>
              {dateConvert(order.created_at, "persian", "english", {
                withTime: true,
              })}
            </p>
          ),
        },
        {
          data: (
            <p>
              {dateConvert(order.updated_at, "persian", "english", {
                withTime: true,
              })}
            </p>
          ),
        },
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
              <ProtectComponent
                permission="transactionsCreate"
                component={
                  <Button
                    size="sm"
                    onPress={() => {
                      setSelectedData(order);
                      transactionsModal.onOpen();
                    }}
                    className="bg-boxBg300"
                  >
                    تراکنش ها
                  </Button>
                }
              />
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
              <ProtectComponent
                permission="ordersEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    onPress={() => {
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
        loading={isLoading ? { columns: 7, rows: 5 } : undefined}
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
            isEditMode
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
      <ModalWrapper
        disclosures={{
          onOpen: transactionsModal.onOpen,
          onOpenChange: transactionsModal.onOpenChange,
          isOpen: transactionsModal.isOpen,
        }}
        size="5xl"
        modalHeader={
          <h2>
            ساخت و مشاهده تراکنش های سفارش{" "}
            {"کاربر: " +
              (selectedData?.user.name
                ? selectedData?.user.name + " - "
                : " ") +
              selectedData?.user.cellphone}
          </h2>
        }
        modalBody={
          <FormTransactions
            onClose={() => editModal.onClose()}
            isEditMode
            order_id={selectedData?.id}
            order_uuid={selectedData?.uuid?.toString()}
            showOrderTransactions
          />
        }
      />
    </>
  );
}
