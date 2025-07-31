"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { UserIndex, PaginateMeta } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { useTableMutateContext } from "@/app/panel/_contexts/tableMutateContext";
import Eye from "@/components/svg/Eye";
import { Button } from "@heroui/button";
import UserForm from "@/app/panel/users/userslist/_components/UserForm";
import { Check, X } from "lucide-react";

export default function TableUsersWholesales() {
  const { filters, changeFilters } = useFiltersContext();
  const { setMutateFunction } = useTableMutateContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/users?panel_access=1${filters ? filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<UserIndex>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) setPage(data.data?.meta?.current_page);
  }, [data]);

  useEffect(() => {
    setMutateFunction(mutate);
  }, [setMutateFunction, mutate]);

  const users: UserIndex[] = data?.data?.users;
  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  const changeAccess = async (panel_access: "0" | "2") => {
    setLoading(true);
    const res = await apiCRUD({
      urlSuffix: `admin-panel/users/${selectedData?.id}`,
      method: "POST",
      data: { panel_access, _method: "put" },
    });
    if (res?.status === "success") {
      mutate();
    }
    setLoading(false);
  };
  const tableData: TableGenerateData = {
    headers: [
      { content: "نام" },
      { content: "شماره موبایل" },
      { content: "دسترسی به پنل عمده" },
      { content: <div></div> },
    ],
    body: users?.map((user) => ({
      cells: [
        { data: <p>{user.name}</p> },
        { data: <p>{user.cellphone}</p> },
        {
          data: (
            <div className="flex min-w-[40px] justify-end gap-1">
              {user.panel_access == "1" && (
                <>
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => changeAccess("2")}
                    className="bg-success"
                    isLoading={loading}
                    isDisabled={loading}
                  >
                    <Check color="var(--success-foreground)" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => changeAccess("0")}
                    className="bg-destructive"
                    isLoading={loading}
                    isDisabled={loading}
                  >
                    <X color="var(--destructive-foreground)" />
                  </Button>
                </>
              )}
            </div>
          ),
        },
        {
          data: (
            <div className="flex min-w-[40px] justify-end gap-1">
              <Button
                isIconOnly
                size="sm"
                onClick={() => {
                  setSelectedData(user);
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
        modalHeader={<h2>ویرایش کاربر</h2>}
        modalBody={
          <UserForm
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
        modalHeader={<h2>مشاهده کاربر</h2>}
        modalBody={
          <UserForm
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
          />
        }
      />
    </>
  );
}
