"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { PaginateMeta, RoleIndex } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useDisclosure } from "@heroui/modal";
import FormRoles from "@/app/panel/users/roles/_components/FormRoles";
import { useTableMutateContext } from "@/app/panel/_contexts/tableMutateContext";
import { dateConvert } from "@/utils/dateConvert";
import Eye from "@/components/svg/Eye";
import Edit from "@/components/svg/Edit";
import { Button } from "@heroui/button";

export default function TableRoles() {
  const { filters, changeFilters } = useFiltersContext();
  const { setMutateFunction } = useTableMutateContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/user/roles${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<RoleIndex>();
  const [Roles, setRoles] = useState<RoleIndex[]>();
  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  useEffect(() => {
    if (data) {
      setRoles(data.data?.roles);
      setPage(data.data?.meta?.current_page);
    }
  }, [data]);

  useEffect(() => {
    setMutateFunction(mutate);
  }, [setMutateFunction, mutate]);

  const tableData: TableGenerateData = {
    headers: [
      { content: "نام" },
      { content: "نام نمایشی" },
      { content: "دسترسی" },
      { content: "تاریخ ایجاد" },
      { content: "تاریخ ویرایش" },
      { content: "" },
    ],
    body: Roles?.map((role) => ({
      cells: [
        { data: <p>{role.name}</p> },
        { data: <p>{role.display_name}</p> },
        { data: <p>{role.access_panel}</p> },
        { data: <p>{dateConvert(role.created_at, "persian")}</p> },
        { data: <p>{dateConvert(role.updated_at, "persian")}</p> },
        {
          data: (
            <div className="flex text-center">
              <div className="flex min-w-[40px] justify-end gap-1">
                <Button
                  isIconOnly
                  size="sm"
                  onClick={() => {
                    setSelectedData(role);
                    seeModal.onOpen();
                  }}
                  className="bg-boxBg300"
                >
                  <Eye color="var(--TextColor)" />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  onClick={() => {
                    setSelectedData(role);
                    editModal.onOpen();
                  }}
                  className="bg-boxBg300"
                >
                  <Edit color="var(--TextColor)" />
                </Button>
              </div>
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
        loading={isLoading ? { columns: 6, rows: 10 } : undefined}
        error={error}
        onRetry={() => mutate()}
      />

      <ModalWrapper
        disclosures={{
          onOpen: editModal.onOpen,
          onOpenChange: editModal.onOpenChange,
          isOpen: editModal.isOpen,
        }}
        size="xl"
        modalHeader={<h2>ویرایش نقش</h2>}
        modalBody={
          <FormRoles
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
        size="xl"
        modalHeader={<h2>مشاهده نقش</h2>}
        modalBody={
          <FormRoles
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
          />
        }
      />
    </>
  );
}
