"use client";

import { useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { PageIndex, PaginateMeta } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import Edit from "@/components/svg/Edit";
import Eye from "@/components/svg/Eye";
import { Button } from "@heroui/button";
import Image from "next/image";
import TooltipCustom from "@/components/datadisplay/TooltipCustom";
import shortenString from "@/utils/shortenString";
import FormPages from "@/app/panel/pages/_components/FormPages";
import ConfirmModal from "@/components/datadisplay/ConfirmModal";
import { Trash2 } from "lucide-react";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import ModalWrapperNative from "@/components/datadisplay/ModalWrapperNative";

export default function TablePages() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/pages${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<PageIndex>();
  const [pageToDelete, setPageToDelete] = useState<PageIndex | null>(null);

  const pages: PageIndex[] = data?.data?.pages;
  const meta: PaginateMeta = data?.data?.meta;

  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    const res = await apiCRUD({
      urlSuffix: `admin-panel/pages/${pageToDelete.id}`,
      method: "DELETE",
    });
    if (res?.status === "success") {
      mutate();
    }
    deleteModal.onClose();
    setPageToDelete(null);
  };

  const tableData: TableGenerateData = {
    headers: [
      { content: "عکس" },
      { content: "عنوان" },
      { content: "نوع" },
      { content: "وضعیت" },
      { content: <div></div> },
    ],
    body: pages?.map((page) => ({
      cells: [
        {
          data: (
            <div className="flex justify-center">
              <Image
                src={
                  page.primary_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + page.primary_image
                    : "/images/imageplaceholder.png"
                }
                alt={page.title}
                width={82}
                height={64}
                className="rounded-[8px]"
              />
            </div>
          ),
        },
        {
          data: (
            <TooltipCustom content={page?.title}>
              <p>{shortenString(page?.title, 14, "before")}</p>
            </TooltipCustom>
          ),
        },
        {
          data: (
            <div className="flex gap-2">
              <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                {page.mode === "none"
                  ? "نا مشخص"
                  : page.mode === "about-us"
                    ? "درباره ما"
                    : page.mode === "contact-us"
                      ? "تماس با ما"
                      : page.mode === "regulations"
                        ? "مقررات"
                        : "نا مشخص"}
              </div>
            </div>
          ),
        },
        {
          data: (
            <div className="min-w-16 rounded bg-accent-4 p-2 text-center text-accent-4-foreground">
              {page.status === "draft"
                ? "پیش نویس"
                : page.status === "approved"
                  ? "تأیید شده"
                  : page.status === "pending"
                    ? "در حال بررسی"
                    : "نا مشخص"}
            </div>
          ),
        },
        {
          data: (
            <div className="flex min-w-[40px] justify-end gap-1">
              <Button
                isIconOnly
                size="sm"
                onPress={() => {
                  setSelectedData(page);
                  seeModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="pagesEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    onPress={() => {
                      setSelectedData(page);
                      editModal.onOpen();
                    }}
                    className="bg-boxBg300"
                  >
                    <Edit color="var(--TextColor)" />
                  </Button>
                }
              />
              <ProtectComponent
                permission="pagesDelete"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    className="group bg-boxBg300 hover:bg-destructive"
                    onPress={() => {
                      setPageToDelete(page);
                      deleteModal.onOpen();
                    }}
                  >
                    <Trash2 className="w-4 text-TextLow group-hover:text-destructive-foreground" />
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
        pagination={{ page, total: meta?.last_page }}
        onPageChange={(page) => {
          setPage(page);
          changeFilters(`page=${page}`);
        }}
        loading={isLoading ? { columns: 5, rows: 5 } : undefined}
        error={error}
        onRetry={() => mutate()}
      />

      <ModalWrapperNative
        disclosures={{
          onOpen: editModal.onOpen,
          onOpenChange: editModal.onOpenChange,
          isOpen: editModal.isOpen,
        }}
        size="5xl"
        modalHeader={<h2>ویرایش صفحه {selectedData?.title}</h2>}
        modalBody={
          <FormPages
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
        modalHeader={<h2>مشاهده صفحه {selectedData?.title}</h2>}
        modalBody={
          <FormPages
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
          />
        }
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        confirmText="آیا مطمئن هستید که می‌خواهید این صفحه را حذف کنید؟"
        confirmAction={handleDeletePage}
        size="md"
        onClose={() => deleteModal.onClose()}
      />
    </>
  );
}
