"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import apiCRUD from "@/services/apiCRUD";
import { useDisclosure } from "@heroui/modal";
import { ProductIndex, PaginateMeta } from "@/types/apiTypes";
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
import FormProducts from "@/app/panel/products/_components/FormProducts";
import formatPrice from "@/utils/formatPrice";
import Link from "next/link";
import {
  CircleHelp,
  DollarSign,
  EllipsisVertical,
  ImagePlus,
} from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import Faqs from "@/app/panel/_components/Faqs";
import FormProductPics from "@/app/panel/products/_components/FormProductPics";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import FormProductPrices from "@/app/panel/products/_components/FormProductPrices";
import { currency } from "@/constants/staticValues";

export default function TableProducts() {
  const { filters, changeFilters } = useFiltersContext();
  const { data, error, isLoading, mutate } = useSWR(
    `admin-panel/products${filters ? "?" + filters : ""}`,
    (url) =>
      apiCRUD({
        urlSuffix: url,
      }),
    { keepPreviousData: true },
  );
  const [page, setPage] = useState(1);
  const priceModal = useDisclosure();
  const seeModal = useDisclosure();
  const faqsModal = useDisclosure();
  const picsModal = useDisclosure();

  const [selectedData, setSelectedData] = useState<ProductIndex>();
  const [switchLoading, setSwitchLoading] = useState<number | undefined>();
  const [products, setProducts] = useState<ProductIndex[]>();

  useEffect(() => {
    if (data) {
      setPage(data.data?.meta?.current_page);
      setProducts(data.data?.products);
    }
  }, [data]);

  const meta: PaginateMeta = data?.data?.meta;
  const pages = meta?.last_page;

  const updateProdState = (updatedItem?: ProductIndex) => {
    if (!updatedItem) return;
    setProducts((prevBrands) =>
      prevBrands?.map((prod) =>
        prod.id === updatedItem.id ? updatedItem : prod,
      ),
    );
  };

  const handleSwitchChange = async (prod: ProductIndex) => {
    setSwitchLoading(prod.id);
    const res = await apiCRUD({
      urlSuffix: `admin-panel/products/${prod.id}`,
      method: "POST",
      data: {
        name: prod.name,
        is_active: prod.is_active == 1 ? 0 : 1,
        _method: "put",
      },
    });
    setSwitchLoading(undefined);
    if (res?.status === "success")
      updateProdState({
        ...prod,
        is_active: prod.is_active == 0 ? 1 : 0,
      });
    else updateProdState({ ...prod, is_active: prod.is_active });
  };

  const tableData: TableGenerateData = {
    headers: [
      { content: "عکس" },
      { content: "نام" },
      { content: "تعداد" },
      { content: "قیمت" },
      { content: "تخفیف" },
      { content: "گارنتی" },
      { content: "وضعیت" },
      { content: <div></div> },
    ],
    body: products?.map((prod) => ({
      cells: [
        {
          data: (
            <div className="flex justify-center">
              <Image
                src={
                  prod.primary_image
                    ? process.env.NEXT_PUBLIC_IMG_BASE + prod.primary_image
                    : "/images/imageplaceholder.png"
                }
                alt={prod.name}
                width={82}
                height={64}
                className="rounded-[8px]"
              />
            </div>
          ),
        },
        { data: <p>{prod.name}</p> },
        { data: <p>{prod.price_check.quantity}</p> },
        {
          data: (
            <p>
              {formatPrice(prod.price_check.price)} {currency}
            </p>
          ),
        },
        {
          data: (
            <p>
              {prod.sale_check && prod.price_check.sale_price
                ? formatPrice(prod.price_check.sale_price) + currency
                : " "}{" "}
            </p>
          ),
        },
        {
          data: (
            <div className="flex gap-2">
              {prod.garranty_type === "repair" ? (
                <div className="min-w-16 rounded bg-accent-1 p-2 text-center text-accent-1-foreground">
                  تعمیر
                </div>
              ) : prod.garranty_type === "replace" ? (
                <div className="min-w-16 rounded bg-accent-3 p-2 text-center text-accent-3-foreground">
                  تعویض
                </div>
              ) : prod.garranty_type === "none" ? (
                <div className="min-w-16 rounded bg-accent-4 p-2 text-center text-accent-4-foreground">
                  ندارد
                </div>
              ) : (
                ""
              )}
            </div>
          ),
        },
        {
          data: (
            <SwitchWrapper
              isSelected={prod.is_active}
              onChange={() => handleSwitchChange(prod)}
              isLoading={switchLoading === prod.id}
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
                  setSelectedData(prod);
                  priceModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <DollarSign className="w-4 text-TextLow" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                onPress={() => {
                  setSelectedData(prod);
                  seeModal.onOpen();
                }}
                className="bg-boxBg300"
              >
                <Eye color="var(--TextColor)" />
              </Button>
              <ProtectComponent
                permission="productsEdit"
                component={
                  <Button
                    isIconOnly
                    size="sm"
                    as={Link}
                    href={`/panel/products/edit/${prod.id}`}
                    className="bg-boxBg300"
                  >
                    <Edit color="var(--TextColor)" />
                  </Button>
                }
              />

              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" className="bg-boxBg300">
                    <EllipsisVertical className="w-5 text-TextColor" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    key="faqs"
                    startContent={<CircleHelp className="w-4 text-TextLow" />}
                    onPress={() => {
                      setSelectedData(prod);
                      faqsModal.onOpen();
                    }}
                  >
                    سوالات متداول
                  </DropdownItem>

                  <DropdownItem
                    key="pics"
                    startContent={<ImagePlus className="w-4 text-TextLow" />}
                    onPress={() => {
                      setSelectedData(prod);
                      picsModal.onOpen();
                    }}
                  >
                    تصاویر محصول
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
        loading={isLoading ? { columns: 8, rows: 5 } : undefined}
        error={error}
        onRetry={() => mutate()}
      />

      <ModalWrapper
        disclosures={{
          onOpen: seeModal.onOpen,
          onOpenChange: seeModal.onOpenChange,
          isOpen: seeModal.isOpen,
        }}
        size="5xl"
        modalHeader={<h2>مشاهده محصول</h2>}
        modalBody={
          <FormProducts
            onClose={() => seeModal.onClose()}
            isShowMode={true}
            productId={selectedData?.id?.toString()}
          />
        }
      />
      <ModalWrapper
        disclosures={{
          onOpen: faqsModal.onOpen,
          onOpenChange: faqsModal.onOpenChange,
          isOpen: faqsModal.isOpen,
        }}
        size="5xl"
        modalHeader={
          <h2>
            سولات متداول محصول {selectedData?.name ? selectedData.name : ""}
          </h2>
        }
        modalBody={
          <div>
            <div>
              <Faqs
                withButton={false}
                id={selectedData?.id}
                type="product"
                mode={"edit"}
              />
            </div>
            <div className="mb-3 mt-3 flex justify-end gap-2">
              <Button
                type="button"
                color="primary"
                onPress={faqsModal.onClose}
                className="rounded-[8px] px-10 text-[14px] font-[500] text-primary-foreground"
              >
                بستن
              </Button>
            </div>
          </div>
        }
      />
      <ModalWrapper
        disclosures={{
          onOpen: picsModal.onOpen,
          onOpenChange: picsModal.onOpenChange,
          isOpen: picsModal.isOpen,
        }}
        size="5xl"
        modalHeader={
          <h2>تصاویر محصول {selectedData?.name ? selectedData.name : ""}</h2>
        }
        modalBody={
          <ProtectComponent
            permission="productsImages"
            component={
              <FormProductPics
                onClose={() => picsModal.onClose()}
                isModal
                productId={selectedData?.id?.toString()}
                productSlug={selectedData?.slug}
              />
            }
            fallback={
              <div>
                <p className="my-5 text-center">شما به این بخش دسترسی ندارید</p>
              </div>
            }
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
          <FormProductPrices
            onClose={() => priceModal.onClose()}
            isModal
            inSiteMode={false}
            productSlug={selectedData?.slug}
          />
        }
      />
    </>
  );
}
