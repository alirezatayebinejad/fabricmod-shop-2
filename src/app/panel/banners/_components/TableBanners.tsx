"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { BannerIndex, PaginateMeta } from "@/types/apiTypes";
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
import FormBanners from "@/app/panel/banners/_components/FormBanners";
import TooltipCustom from "@/components/datadisplay/TooltipCustom";
import shortenString from "@/utils/shortenString";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function TableBanners() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/banners${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const editModal = useDisclosure();
  const seeModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<BannerIndex>();
  const [switchLoading, setSwitchLoading] = useState<number | undefined>();
  const [banners, setBrands] = useState<BannerIndex[]>();

  useEffect(() => {
    if (data) {
      setPage(data.data?.meta?.current_page);
      setBrands(data.data?.banners);
    }
  }, [data]);

  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  const updateBannerState = (updatedItem?: BannerIndex) => {
    if (!updatedItem) return;
    setBrands((prevBrands) =>
      prevBrands?.map((banner) =>
        banner.id === updatedItem.id ? updatedItem : banner,
      ),
    );
  };

  const handleSwitchChange = async (banner: BannerIndex) => {
    setSwitchLoading(banner.id);
    const res = await apiCRUD({
      urlSuffix: `admin-panel/banners/${banner.id}`,
      method: "POST",
      updateCacheByTag: "index",
      data: {
        title: banner.title,
        is_active: banner.is_active == 1 ? 0 : 1,
        _method: "put",
      },
    });
    setSwitchLoading(undefined);
    if (res?.status === "success")
      updateBannerState({
        ...banner,
        is_active: banner.is_active == 0 ? 1 : 0,
      });
    else updateBannerState({ ...banner, is_active: banner.is_active });
  };

  const tableData: TableGenerateData = {
    headers: [
      { content: "عکس" },
      { content: "نام" },
      { content: "نوع" },
      { content: "آدرس" },
      { content: "وضعیت" },
      { content: <div></div> },
    ],
    body: banners?.map((banner) => ({
      cells: [
        {
          data: (
            <div className="flex justify-center">
              <Image
                src={
                  banner.image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + banner.image
                    : "/images/imageplaceholder.png"
                }
                alt={banner.title || "بنر"}
                width={82}
                height={64}
                className="rounded-[8px]"
              />
            </div>
          ),
        },
        {
          data: (
            <TooltipCustom content={banner?.title}>
              <p>{shortenString(banner?.title, 14, "before")}</p>
            </TooltipCustom>
          ),
        },
        {
          data: (
            <div className="flex gap-2">
              {banner.mode === "single" ? (
                <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  حالت تکی
                </div>
              ) : banner.mode === "two" ? (
                <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  حالت دو
                </div>
              ) : banner.mode === "two_half" ? (
                <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  حالت دو و نیم
                </div>
              ) : banner.mode === "three" ? (
                <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  حالت سه تایی
                </div>
              ) : banner.mode === "four" ? (
                <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  حالت چهار
                </div>
              ) : banner.mode === "shop" ? (
                <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  فروشگاه
                </div>
              ) : banner.mode === "blog" ? (
                <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  بلاگ
                </div>
              ) : banner.mode === "call_to_action" ? (
                <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  کال تو اکشن
                </div>
              ) : banner.mode === "slider" ? (
                <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  اسلایدر
                </div>
              ) : (
                "نا مشخص"
              )}
            </div>
          ),
        },
        {
          data: (
            <TooltipCustom content={banner?.url}>
              <p>{shortenString(banner?.url, 14, "before")}</p>
            </TooltipCustom>
          ),
        },
        {
          data: (
            <SwitchWrapper
              isSelected={banner.is_active}
              onChange={() => handleSwitchChange(banner)}
              isLoading={switchLoading === banner.id}
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
                  setSelectedData(banner);
                  seeModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="bannersEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    onClick={() => {
                      setSelectedData(banner);
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
        modalHeader={<h2>ویرایش بنر ها</h2>}
        modalBody={
          <FormBanners
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
        modalHeader={<h2>مشاهده بنر ها</h2>}
        modalBody={
          <FormBanners
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            selectedData={selectedData}
          />
        }
      />
    </>
  );
}
