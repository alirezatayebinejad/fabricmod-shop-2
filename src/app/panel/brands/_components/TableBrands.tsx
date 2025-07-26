"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { BrandsIndex, PaginateMeta } from "@/types/apiTypes";
import TableGenerate, {
  TableGenerateData,
} from "@/components/datadisplay/TableGenerate";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useFiltersContext } from "@/contexts/SearchFilters";
import Edit from "@/components/svg/Edit";
import Eye from "@/components/svg/Eye";
import { Button } from "@heroui/button";
import FormBrands from "@/app/panel/brands/_components/FormBrands";
import Image from "next/image";
import SwitchWrapper from "@/components/inputs/SwitchWrapper";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function TableBrands() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/brands${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<BrandsIndex>();
  const [switchLoading, setSwitchLoading] = useState<number | undefined>();
  const [brands, setBrands] = useState<BrandsIndex[]>();

  useEffect(() => {
    if (data) {
      setPage(data.data?.meta?.current_page);
      setBrands(data.data?.brands);
    }
  }, [data]);

  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  const updateBrandState = (updatedItem?: BrandsIndex) => {
    if (!updatedItem) return;
    setBrands((prevBrands) =>
      prevBrands?.map((brand) =>
        brand.id === updatedItem.id ? updatedItem : brand,
      ),
    );
  };

  const handleSwitchChange = async (brand: BrandsIndex) => {
    setSwitchLoading(brand.id);
    const res = await apiCRUD({
      urlSuffix: `admin-panel/brands/${brand.id}`,
      method: "POST",
      updateCacheByTag: "initials",
      data: {
        name: brand.name,
        is_active: brand.is_active == 1 ? 0 : 1,
        _method: "put",
      },
    });
    setSwitchLoading(undefined);
    if (res?.status === "success")
      updateBrandState({
        ...brand,
        is_active: brand.is_active == 0 ? 1 : 0,
      });
    else updateBrandState({ ...brand, is_active: brand.is_active });
  };

  const tableData: TableGenerateData = {
    headers: [
      { content: "عکس" },
      { content: "نام" },
      { content: "وضعیت" },
      { content: <div></div> },
    ],
    body: brands?.map((brand) => ({
      cells: [
        {
          data: (
            <div className="flex justify-center">
              <Image
                src={
                  brand.primary_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + brand.primary_image
                    : "/images/imageplaceholder.png"
                }
                alt={brand.name}
                width={82}
                height={64}
                className="rounded-[8px]"
              />
            </div>
          ),
        },
        { data: <p>{brand.name}</p> },

        {
          data: (
            <SwitchWrapper
              isSelected={brand.is_active}
              onChange={() => handleSwitchChange(brand)}
              isLoading={switchLoading === brand.id}
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
                  setSelectedData(brand);
                  seeModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="brandsEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => {
                      setSelectedData(brand);
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
        modalHeader={<h2>ویرایش برند</h2>}
        modalBody={
          <FormBrands
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
        modalHeader={<h2>مشاهده برند</h2>}
        modalBody={
          <FormBrands
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
          />
        }
      />
    </>
  );
}
