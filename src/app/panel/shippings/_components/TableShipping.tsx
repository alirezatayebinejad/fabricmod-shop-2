"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { PaginateMeta, ShippingmethodIndex } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import Edit from "@/components/svg/Edit";
import Eye from "@/components/svg/Eye";
import { Button } from "@heroui/button";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import FormShipping from "@/app/panel/shippings/_components/FormShipping";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import { currency } from "@/constants/staticValues";

export default function TableShipping() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/shipping-methods${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<ShippingmethodIndex>();
  const [switchLoading, setSwitchLoading] = useState<number | undefined>();
  const [shippingMethods, setShippingMethods] =
    useState<ShippingmethodIndex[]>();

  useEffect(() => {
    if (data) {
      setPage(data.data?.meta?.current_page);
      setShippingMethods(data.data?.shipping_methods);
    }
  }, [data]);

  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  const updateShippingMethodState = (updatedItem?: ShippingmethodIndex) => {
    if (!updatedItem) return;
    setShippingMethods((prevMethods) =>
      prevMethods?.map((method) =>
        method.id === updatedItem.id ? updatedItem : method,
      ),
    );
  };

  const handleSwitchChange = async (method: ShippingmethodIndex) => {
    setSwitchLoading(method.id);
    const res = await apiCRUD({
      urlSuffix: `admin-panel/shipping-methods/${method.id}`,
      method: "POST",
      data: {
        name: method.name,
        is_active: method.is_active == 1 ? 0 : 1,
        _method: "put",
      },
    });
    setSwitchLoading(undefined);
    if (res?.status === "success")
      updateShippingMethodState({
        ...method,
        is_active: method.is_active == 0 ? 1 : 0,
      });
    else updateShippingMethodState({ ...method, is_active: method.is_active });
  };

  const tableData: TableGenerateData = {
    headers: [
      { content: "نام" },
      { content: "کد" },
      { content: "هزینه پایه" },
      { content: "هزینه بر وزن" },
      { content: "فعال" },
      { content: <div></div> },
    ],
    body: shippingMethods?.map((method) => ({
      cells: [
        {
          data: method.name,
        },
        {
          data: method.code,
        },
        {
          data: method.base_cost + " " + currency,
        },
        {
          data: method.per_weight_cost + " " + currency,
        },
        {
          data: (
            <SwitchWrapper
              isSelected={method.is_active}
              onChange={() => handleSwitchChange(method)}
              isLoading={switchLoading === method.id}
            />
          ),
        },
        {
          data: (
            <div className="flex min-w-[40px] justify-end gap-1">
              <Button
                isIconOnly
                size="sm"
                onClick={() => {
                  setSelectedData(method);
                  seeModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="shippingsEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => {
                      setSelectedData(method);
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
        modalHeader={<h2>ویرایش روش ارسال {selectedData?.name}</h2>}
        modalBody={
          <FormShipping
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
        modalHeader={<h2>مشاهده روش ارسال {selectedData?.name}</h2>}
        modalBody={
          <FormShipping
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
          />
        }
      />
    </>
  );
}
