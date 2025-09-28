import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { useSWRConfig } from "swr";
import useSWR from "swr";
import Image from "next/image";
import apiCRUD from "@/services/apiCRUD";
import useMyForm from "@/hooks/useMyForm";
import InputBasic from "@/components/inputs/InputBasic";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import TextAreaCustom from "@/components/inputs/TextAreaCustom";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { Transactions } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import StatusBadge from "@/components/datadisplay/StatusBadge";
import { currency } from "@/constants/staticValues";
import Eye from "@/components/svg/Eye";
import Edit from "@/components/svg/Edit";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useDisclosure } from "@heroui/modal";
import { dateConvert } from "@/utils/dateConvert";

type Props = {
  onClose: () => void;
  isEditMode?: boolean;
  isShowMode?: boolean;
  selectedData?: Transactions;
  order_id?: number;
  order_uuid?: string;
  showOrderTransactions?: boolean;
  mutateUrl?: string;
};

export default function FormTransactions({
  onClose,
  isEditMode = false,
  isShowMode = false,
  selectedData,
  order_id,
  order_uuid,
  showOrderTransactions = false,
  mutateUrl,
}: Props) {
  const { filters } = useFiltersContext();
  const { mutate } = useSWRConfig();

  // For showing order's transactions
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<Transactions[]>();
  const [pages, setPages] = useState<number>(1);

  // For modal state for show/edit transaction
  const editModal = useDisclosure();
  const seeModal = useDisclosure();
  const [modalSelectedData, setModalSelectedData] = useState<
    Transactions | undefined
  >(undefined);

  // Only fetch if showOrderTransactions and order_id is present
  const {
    data: orderTransactionsData,
    error: orderTransactionsError,
    isLoading: orderTransactionsLoading,
    mutate: orderTransactionsMutate,
  } = useSWR(
    showOrderTransactions && order_id
      ? `admin-panel/transactions?order_id=${order_id}&page=${page}`
      : null,
    (url) => apiCRUD({ urlSuffix: url }),
    { keepPreviousData: true },
  );

  useEffect(() => {
    if (orderTransactionsData && showOrderTransactions) {
      setTransactions(orderTransactionsData.data?.transactions);
      setPages(orderTransactionsData.data?.meta?.last_page || 1);
    }
  }, [orderTransactionsData, showOrderTransactions]);

  const {
    values,
    errors,
    loading,
    handleChange,
    setValues,
    handleSubmit,
    setErrors,
  } = useMyForm(
    {
      order_id: order_id,
      order_uuid: order_uuid,
      amount: selectedData?.amount ?? "",
      description: selectedData?.description ?? "",
      gateway_name: selectedData?.gateway_name ?? "",
      status: selectedData?.status ?? "",
    },
    async (formValues) => {
      const res = await apiCRUD({
        urlSuffix: `admin-panel/transactions${isEditMode && selectedData?.id ? `/${selectedData.id}` : ""}`,
        method: "POST",
        updateCacheByTag: "transactions",
        data: { ...formValues, _method: isEditMode ? "put" : "post" },
      });
      if (res?.message) setErrors(res.message);
      if (res?.status === "success") {
        onClose();
        mutate(
          mutateUrl
            ? mutateUrl
            : `admin-panel/transactions${filters ? "?" + filters : ""}`,
        );
        if (showOrderTransactions && order_id) {
          orderTransactionsMutate();
        }
      }
    },
  );

  // Table config for order's transactions
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
                  setModalSelectedData(transaction);
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
                      setModalSelectedData(transaction);
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
      <form noValidate onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputBasic
            name="amount"
            label="مبلغ"
            type="number"
            value={values.amount}
            onChange={handleChange("amount")}
            errorMessage={errors.amount}
            isDisabled={isShowMode}
          />
          <SelectSearchCustom
            title="درگاه پرداخت"
            options={[
              { id: "cash", title: "نقدی" },
              { id: "card", title: "کارت" },
              { id: "admin", title: "ادمین" },
            ]}
            isDisable={isShowMode}
            defaultValue={
              values.gateway_name
                ? [
                    [
                      { id: "cash", title: "نقدی" },
                      { id: "card", title: "کارت" },
                      { id: "admin", title: "ادمین" },
                      { id: "check", title: "چک" },
                    ].find((opt) => opt.id === values.gateway_name) || {
                      id: values.gateway_name,
                      title: values.gateway_name,
                    },
                  ]
                : []
            }
            onChange={(selected) =>
              setValues((prev) => ({
                ...prev,
                gateway_name: selected?.[0]?.id.toString() || "",
              }))
            }
            errorMessage={errors.gateway_name}
            placeholder="انتخاب"
          />
          {isShowMode && (
            <>
              <InputBasic
                name="created_at"
                label="تاریخ ایجاد"
                isDisabled
                value={
                  selectedData?.created_at
                    ? (dateConvert(
                        selectedData.created_at,
                        "persian",
                      ) as string)
                    : "-"
                }
              />
              <InputBasic
                name="updated_at"
                label="تاریخ بروزرسانی"
                isDisabled
                value={
                  selectedData?.updated_at
                    ? (dateConvert(
                        selectedData.updated_at,
                        "persian",
                      ) as string)
                    : "-"
                }
              />
            </>
          )}
          {isShowMode && selectedData?.image && (
            <div className="col-span-full">
              <label className="mb-2 block text-sm font-medium text-TextColor">
                تصویر تراکنش
              </label>
              <div className="relative inline-block">
                <Image
                  src={process.env.NEXT_PUBLIC_IMG_BASE + selectedData.image}
                  alt="تصویر تراکنش"
                  width={128}
                  height={128}
                  className="h-32 w-32 cursor-pointer rounded-lg border border-border object-cover transition-transform hover:scale-105"
                  onClick={() =>
                    selectedData.image &&
                    window.open(
                      process.env.NEXT_PUBLIC_IMG_BASE + selectedData.image,
                      "_blank",
                    )
                  }
                />
              </div>
            </div>
          )}
          <SelectSearchCustom
            title="وضعیت"
            options={[
              { id: "pending", title: "در انتظار" },
              { id: "success", title: "موفق" },
            ]}
            isDisable={isShowMode}
            defaultValue={
              values.status
                ? [
                    [
                      { id: "pending", title: "در انتظار" },
                      { id: "success", title: "موفق" },
                    ].find((opt) => opt.id === values.status) || {
                      id: values.status,
                      title: values.status,
                    },
                  ]
                : []
            }
            onChange={(selected) =>
              setValues((prev) => ({
                ...prev,
                status: selected?.[0]?.id.toString() || "",
              }))
            }
            errorMessage={errors.status}
            placeholder="انتخاب"
          />
        </div>
        <div className="mt-3">
          <TextAreaCustom
            label="توضیحات"
            name="description"
            isDisabled={isShowMode}
            value={values.description}
            onChange={(val) => handleChange("description")(val)}
            errorMessage={errors.description}
          />
        </div>
        <div className="mb-3 mt-3 flex justify-end gap-2">
          <Button
            type="button"
            className="rounded-[8px] border-1 border-border bg-transparent px-6 text-[14px] font-[500] text-TextColor"
            variant="light"
            onPress={onClose}
          >
            {isShowMode ? "بستن" : "لغو"}
          </Button>
          {!isShowMode && (
            <Button
              type="submit"
              isLoading={loading}
              color="primary"
              className="rounded-[8px] px-10 text-[14px] font-[500] text-primary-foreground"
            >
              ذخیره
            </Button>
          )}
        </div>
      </form>
      {showOrderTransactions && order_id && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-bold">تراکنش‌های این سفارش</h3>
          <TableGenerate
            data={tableData}
            stripedRows
            pagination={{ page, total: pages }}
            onPageChange={(newPage) => setPage(newPage)}
            loading={
              orderTransactionsLoading ? { columns: 6, rows: 5 } : undefined
            }
            error={orderTransactionsError}
            onRetry={() => orderTransactionsMutate()}
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
                isEditMode
                selectedData={modalSelectedData}
                order_id={order_id}
                order_uuid={order_uuid}
                showOrderTransactions={false}
                mutateUrl={`admin-panel/transactions?order_id=${order_id}&page=${page}`}
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
                selectedData={modalSelectedData}
                order_id={order_id}
                order_uuid={order_uuid}
                showOrderTransactions={false}
                mutateUrl={`admin-panel/transactions?order_id=${order_id}&page=${page}`}
              />
            }
          />
        </div>
      )}
    </>
  );
}
