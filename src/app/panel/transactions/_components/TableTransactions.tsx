"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { Transactions, PaginateMeta } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import Edit from "@/components/svg/Edit";
import Eye from "@/components/svg/Eye";
import { Button } from "@heroui/button";
import StatusBadge from "@/components/datadisplay/StatusBadge";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import { currency } from "@/constants/staticValues";
import FormTransactions from "@/app/panel/transactions/_components/FormTransactions";

export default function TableTransactions() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/transactions${filters ? "?" + filters : "?"}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<Transactions>();
  const [transactions, setTransactions] = useState<Transactions[]>();

  useEffect(() => {
    if (data) {
      setPage(data.data?.meta?.current_page);
      setTransactions(data.data?.transactions);
    }
  }, [data]);

  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  const tableData: TableGenerateData = {
    headers: [
      { content: "کاربر" },
      { content: "مبلغ" },
      { content: "درگاه" },
      { content: "وضعیت" },
      { content: "تاریخ" },
      { content: <div></div> },
    ],
    body: transactions?.map((transaction) => ({
      cells: [
        {
          data: <p>{transaction.user?.name || transaction.user?.cellphone}</p>,
        },
        { data: <p>{transaction.amount + " " + currency}</p> },
        { data: <p>{transaction.gateway_name}</p> },
        {
          data: (
            <StatusBadge
              title={
                transaction.status === "success"
                  ? "پرداخت موفق"
                  : transaction.status === "pending"
                    ? "در حال انتظار"
                    : transaction.status === "rejected"
                      ? "پرداخت ناموفق"
                      : "نامشخص"
              }
              mode={
                transaction.status === "success"
                  ? "success"
                  : transaction.status === "pending"
                    ? "pending"
                    : transaction.status === "rejected"
                      ? "error"
                      : undefined
              }
            />
          ),
        },
        {
          data: (
            <p>
              {transaction.created_at
                ? new Date(transaction.created_at).toLocaleDateString("fa-IR")
                : "-"}
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
                  setSelectedData(transaction);
                  seeModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="transactionsEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => {
                      setSelectedData(transaction);
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
        loading={isLoading ? { columns: 6, rows: 5 } : undefined}
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
        modalHeader={<h2>ویرایش تراکنش</h2>}
        modalBody={
          <FormTransactions
            onClose={() => editModal.onClose()}
            selectedData={selectedData}
            isEditMode
            order_id={selectedData?.order.id}
            order_uuid={selectedData?.order.uuid?.toString()}
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
        modalHeader={<h2>مشاهده تراکنش</h2>}
        modalBody={
          <FormTransactions
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
            order_id={selectedData?.order.id}
            order_uuid={selectedData?.order.uuid?.toString()}
          />
        }
      />
    </>
  );
}
