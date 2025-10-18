"use client";

import { Button, ButtonGroup } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import FormCategories from "@/app/panel/categories/_components/FormCategories";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import { useFiltersContext } from "@/contexts/SearchFilters";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import { cn } from "@/utils/twMerge";
import InputBasic from "@/components/inputs/InputBasic";
import { useState } from "react";
import { Search } from "lucide-react";
import ModalWrapperNative from "@/components/datadisplay/ModalWrapperNative";

export default function HeaderCategories() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { changeFilters, getFilterValue, deleteFilter } = useFiltersContext();
  const [search, setSearch] = useState("");
  const isParentFilterValue = getFilterValue("is_parent");
  const typeFilterValue = getFilterValue("type");
  const isActiveValue = getFilterValue("is_active");

  const handleSearch = () => {
    if (search) {
      changeFilters("search=" + search);
    } else {
      deleteFilter("search");
    }
  };

  return (
    <div>
      <ProtectComponent
        permission="categoryCreate"
        component={
          <Button
            onPress={onOpen}
            color="secondary"
            className="h-[40px] rounded-[5px] bg-accent-2 p-[0_30px] text-[16px] font-[600] text-accent-2-foreground"
          >
            ساخت دسته بندی جدید
          </Button>
        }
      />

      <div className="my-6 flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-wrap gap-2">
          <InputBasic
            name="search"
            type="search"
            placeholder="جستجو..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            endContent={
              <Search
                className="cursor-pointer text-TextMute"
                onClick={handleSearch}
              />
            }
          />
          <ButtonGroup variant="ghost" className="mr-5">
            <Button
              className={cn(
                "h-[40px] !rounded-[0_5px_5px_0] !border-1 p-[0_30px] text-[16px] font-[600] text-TextColor",
                typeFilterValue === "product" ? "bg-boxBg250" : "",
              )}
              onPress={() => changeFilters("type=product")}
            >
              محصولات
            </Button>
            <Button
              className={cn(
                "h-[40px] !rounded-[5px_0_0_5px] !border-1 p-[0_30px] text-[16px] font-[600] text-TextColor",
                typeFilterValue === "post" ? "bg-boxBg250" : "",
              )}
              onPress={() => changeFilters("type=post")}
            >
              پست ها
            </Button>
          </ButtonGroup>
          <ModalWrapperNative
            disclosures={{
              isOpen,
              onOpenChange,
              onOpen,
            }}
            size="5xl"
            modalHeader={<h2>ساخت دسته بندی جدید</h2>}
            modalBody={<FormCategories onClose={onOpenChange} />}
          />
        </div>

        <div className="flex gap-2 max-md:flex-wrap lg:min-w-[420px]">
          <SelectSearchCustom
            options={[{ id: 1, title: "والد" }]}
            placeholder="نوع والد"
            isSearchDisable
            onChange={(selected) => {
              if (selected.length > 0 && selected[0].id !== undefined) {
                changeFilters("is_parent=" + selected[0].id);
              } else {
                deleteFilter("is_parent");
              }
            }}
            defaultValue={
              isParentFilterValue && isParentFilterValue === "1"
                ? [{ id: 1, title: "والد" }]
                : undefined
            }
          />
          <SelectSearchCustom
            options={[
              { id: "post", title: "پست" },
              { id: "product", title: "محصول" },
            ]}
            placeholder="بخش دسته"
            isSearchDisable
            onChange={(selected) => {
              if (selected.length > 0 && selected[0].id !== undefined) {
                changeFilters("type=" + selected[0].id);
              } else {
                deleteFilter("type");
              }
            }}
            defaultValue={
              typeFilterValue
                ? [
                    {
                      id: typeFilterValue,
                      title:
                        typeFilterValue === "post"
                          ? "پست"
                          : typeFilterValue === "product"
                            ? "محصول"
                            : "",
                    },
                  ]
                : undefined
            }
          />
          <SelectSearchCustom
            options={[
              { id: "1", title: "فعال" },
              { id: "0", title: "غیرفعال" },
            ]}
            placeholder="وضعیت"
            isSearchDisable
            onChange={(selected) => {
              if (selected.length > 0 && selected[0].id !== undefined) {
                changeFilters("is_active=" + selected[0].id);
              } else {
                deleteFilter("is_active");
              }
            }}
            defaultValue={
              isActiveValue === "1"
                ? [{ id: "1", title: "فعال" }]
                : isActiveValue === "0"
                  ? [{ id: "0", title: "غیرفعال" }]
                  : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
