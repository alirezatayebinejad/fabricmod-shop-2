"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { CouponIndex, PaginateMeta } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import Edit from "@/components/svg/Edit";
import Eye from "@/components/svg/Eye";
import { Button } from "@heroui/button";
import { dateConvert } from "@/utils/dateConvert";
import FormCoupons from "@/app/panel/coupons/_components/FormCoupons";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function TableCoupons() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/coupons${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<CouponIndex>();
  const [Coupons, setCoupons] = useState<CouponIndex[]>();

  useEffect(() => {
    if (data) {
      setPage(data.data?.meta?.current_page);
      setCoupons(data.data?.coupons);
    }
  }, [data]);

  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  const tableData: TableGenerateData = {
    headers: [
      { content: "نام" },
      { content: "کد" },
      { content: "نوع" },
      { content: "مقدار" },
      { content: "تاریخ انقضا" },
      { content: <div></div> },
    ],
    body: Coupons?.map((coupon) => ({
      cells: [
        {
          data: coupon.name,
        },
        {
          data: coupon.code,
        },
        {
          data:
            coupon.type === "amount"
              ? "مقدرای"
              : coupon.type === "percentage"
                ? "درصدی"
                : "نامشخص",
        },
        {
          data: coupon.value,
        },
        {
          data: dateConvert(coupon.expire_at, "persian"),
        },
        {
          data: (
            <div className="flex min-w-[40px] justify-end gap-1">
              <Button
                isIconOnly
                size="sm"
                onPress={() => {
                  setSelectedData(coupon);
                  seeModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="couponsUpdate"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    onPress={() => {
                      setSelectedData(coupon);
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
        modalHeader={<h2>ویرایش کد تخفیف {selectedData?.name}</h2>}
        modalBody={
          <FormCoupons
            onClose={() => editModal.onClose()}
            isEditMode={true}
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
        modalHeader={<h2>مشاهده کد تخفیف {selectedData?.name}</h2>}
        modalBody={
          <FormCoupons
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
          />
        }
      />
    </>
  );
}
