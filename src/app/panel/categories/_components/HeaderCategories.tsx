"use client";

import { Button } from "@heroui/button";
import ModalWrapper from "@/components/datadisplay/ModalWrapper";
import { useDisclosure } from "@heroui/modal";
import FormCategories from "@/app/panel/categories/_components/FormCategories";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import { useFiltersContext } from "@/contexts/SearchFilters";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function HeaderCategories() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { changeFilters, getFilterValue, deleteFilter } = useFiltersContext();

  const isParentFilterValue = getFilterValue("is_parent");
  const typeFilterValue = getFilterValue("type");

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-5">
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
        <ModalWrapper
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
      <div className="flex gap-4 lg:min-w-[300px]">
        <SelectSearchCustom
          options={[{ id: 1, title: "والد" }]}
          placeholder="انتخاب نوع والد"
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
          classNames={{ base: "min-w-[130px]" }}
        />
        <SelectSearchCustom
          options={[
            { id: "post", title: "پست" },
            { id: "product", title: "محصول" },
          ]}
          placeholder="انتخاب نوع"
          isSearchDisable
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("type=" + selected[0].id);
            } else {
              deleteFilter("type");
            }
          }}
          classNames={{ base: "min-w-[130px]" }}
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
            { id: "0", title: "فقط ست ها" },
            { id: "1", title: "فقط غیر ست ها" },
          ]}
          placeholder="نوع ست"
          isSearchDisable
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("is_set=" + selected[0].id);
            } else {
              deleteFilter("is_set");
            }
          }}
          showNoOneOption
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
          classNames={{ base: "min-w-[100px]" }}
        />
      </div>
    </div>
  );
}
