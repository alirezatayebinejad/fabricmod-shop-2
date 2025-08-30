"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { CategoryIndex, PaginateMeta } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import Edit from "@/components/svg/Edit";
import Eye from "@/components/svg/Eye";
import { Button } from "@heroui/button";
import Image from "next/image";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import FormCategories from "@/app/panel/categories/_components/FormCategories";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import { DollarSign } from "lucide-react";
import FormCategPrice from "@/app/panel/categories/_components/FormCategPrice";

export default function TableCategories() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/categories${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const priceModal = useDisclosure();
  const editModal = useDisclosure();
  const seeModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<CategoryIndex>();
  const [switchLoading, setSwitchLoading] = useState<number | undefined>();
  const [categories, setCategories] = useState<CategoryIndex[]>();

  useEffect(() => {
    if (data) {
      setPage(data.data?.meta?.current_page);
      setCategories(data.data?.categories);
    }
  }, [data]);

  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  const updateCategState = (updatedItem?: CategoryIndex) => {
    if (!updatedItem) return;
    setCategories((prevBrands) =>
      prevBrands?.map((categ) =>
        categ.id === updatedItem.id ? updatedItem : categ,
      ),
    );
  };
  const handleSwitchChange = async (categ: CategoryIndex) => {
    setSwitchLoading(categ.id);
    const res = await apiCRUD({
      urlSuffix: `admin-panel/categories/${categ.id}`,
      method: "POST",
      updateCacheByTag: ["initials", "index"],
      noCacheToast: true,
      data: {
        name: categ.name,
        is_active: categ.is_active == 1 ? 0 : 1,
        _method: "put",
      },
    });
    setSwitchLoading(undefined);
    if (res?.status === "success")
      updateCategState({
        ...categ,
        is_active: categ.is_active == 0 ? 1 : 0,
      });
    else updateCategState({ ...categ, is_active: categ.is_active });
  };

  const tableData: TableGenerateData = {
    headers: [
      { content: "عکس" },
      { content: "نام" },
      { content: "بخش" },
      { content: "نوع" },
      { content: "وضعیت" },
      { content: <div></div> },
    ],
    body: categories?.map((categ) => ({
      cells: [
        {
          data: (
            <div className="flex justify-center">
              <Image
                src={
                  categ.primary_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + categ.primary_image
                    : "/images/imageplaceholder.png"
                }
                alt={categ.name}
                width={82}
                height={64}
                className="rounded-[8px]"
              />
            </div>
          ),
        },
        { data: <p>{categ.name}</p> },
        {
          data: (
            <div>
              {categ.type === "product" ? (
                <div className="min-w-10 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  محصول
                </div>
              ) : (
                <div className="min-w-10 rounded bg-accent-3 p-2 text-center text-accent-3-foreground">
                  پست
                </div>
              )}
            </div>
          ),
        },
        {
          data: (
            <div>
              {categ.parent_id?.toString() === "0" ? (
                <div className="min-w-10 rounded bg-accent-4 p-2 text-center text-accent-4-foreground">
                  والد
                </div>
              ) : (
                <div className="min-w-10 rounded bg-accent-3 p-2 text-center text-accent-3-foreground">
                  فرزند
                </div>
              )}
            </div>
          ),
        },
        {
          data: (
            <SwitchWrapper
              isSelected={categ.is_active}
              onChange={() => handleSwitchChange(categ)}
              isLoading={switchLoading === categ.id}
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
                  setSelectedData(categ);
                  priceModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <DollarSign className="w-4 text-TextLow" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                onClick={() => {
                  setSelectedData(categ);
                  seeModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="categoryEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => {
                      setSelectedData(categ);
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
        modalHeader={<h2>ویرایش دسته بندی</h2>}
        modalBody={
          <FormCategories
            onClose={() => editModal.onClose()}
            isEditMode={true}
            selectedData={selectedData}
          />
        }
      />
      <ModalWrapper
        disclosures={{
          onOpen: priceModal.onOpen,
          onOpenChange: priceModal.onOpenChange,
          isOpen: priceModal.isOpen,
        }}
        size="5xl"
        isDismissable
        modalHeader={
          <h2>
            قیمت گزاری محصول {selectedData?.name ? selectedData.name : ""}
          </h2>
        }
        modalBody={
          <FormCategPrice
            onClose={() => priceModal.onClose()}
            isModal
            categ={selectedData}
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
        modalHeader={<h2>مشاهده دسته بندی</h2>}
        modalBody={
          <FormCategories
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
          />
        }
      />
    </>
  );
}
