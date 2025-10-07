"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { PaginateMeta, Attributes } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import Edit from "@/components/svg/Edit";
import Eye from "@/components/svg/Eye";
import { Button } from "@heroui/button";
import FormAttributes from "@/app/panel/attributes/_components/FormAttributes";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function TableAttributes() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/attributes${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();
  const [selectedData, setSelectedData] = useState<Attributes>();
  const [switchLoading, setSwitchLoading] = useState<number | undefined>();
  const [attrs, setAttrs] = useState<Attributes[]>();

  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  useEffect(() => {
    if (data) {
      setPage(data.data?.meta?.current_page);
      setAttrs(data.data?.attributes);
    }
  }, [data]);

  const updateAttrState = (updatedItem?: Attributes) => {
    if (!updatedItem) return;
    setAttrs((prevAttr) =>
      prevAttr?.map((Attr) =>
        Attr.id === updatedItem.id ? updatedItem : Attr,
      ),
    );
  };

  const handleSwitchChange = async (attr: Attributes) => {
    setSwitchLoading(attr.id);
    const res = await apiCRUD({
      urlSuffix: `admin-panel/attributes/${attr.id}`,
      method: "POST",
      data: {
        name: attr.name,
        is_active: attr.is_active == 1 ? 0 : 1,
        _method: "put",
      },
    });
    setSwitchLoading(undefined);
    if (res?.status === "success")
      updateAttrState({
        ...attr,
        is_active: attr.is_active == 0 ? 1 : 0,
      });
    else updateAttrState({ ...attr, is_active: attr.is_active });
  };
  const tableData: TableGenerateData = {
    headers: [
      { content: "نام" },
      { content: "slug" },
      { content: "وضعیت" },
      { content: <div></div> },
    ],
    body: attrs?.map((attr) => ({
      cells: [
        { data: <p>{attr.name}</p> },
        { data: <p>{attr.slug}</p> },
        {
          data: (
            <SwitchWrapper
              isSelected={attr.is_active}
              onChange={() => handleSwitchChange(attr)}
              isLoading={switchLoading === attr.id}
            />
          ),
        },

        {
          data: (
            <div className="flex min-w-[40px] justify-end gap-1">
              <Button
                isIconOnly
                size="sm"
                onPress={() => {
                  setSelectedData(attr);
                  seeModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="attributesEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    onPress={() => {
                      setSelectedData(attr);
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
        loading={isLoading ? { columns: 4, rows: 5 } : undefined}
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
        modalHeader={<h2>ویرایش ویژگی</h2>}
        modalBody={
          <FormAttributes
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
        modalHeader={<h2>مشاهده ویژگی</h2>}
        modalBody={
          <FormAttributes
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
          />
        }
      />
    </>
  );
}
