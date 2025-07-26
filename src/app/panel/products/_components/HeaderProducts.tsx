"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import { useFiltersContext } from "@/contexts/SearchFilters";
import apiCRUD from "@/services/apiCRUD";
import { CategoryIndex } from "@/types/apiTypes";
import { useEffect, useState } from "react";
import InputBasic from "@/components/inputs/InputBasic";
import { Search } from "lucide-react";
import ProtectComponent from "@/components/wrappers/ProtectComponent";

export default function HeaderProducts() {
  const { changeFilters, getFilterValue, deleteFilter } = useFiltersContext();
  const categFilterValue = getFilterValue("parent_id");
  const sortByFilterValue = getFilterValue("sortBy");
  const existFilterValue = getFilterValue("exist");
  const offerFilterValue = getFilterValue("offer");
  const [categs, setCategs] = useState<CategoryIndex[]>();
  const [search, setSearch] = useState("");

  const requestSelectOptions = async () => {
    const catData = await apiCRUD({
      urlSuffix: `admin-panel/categories?type=product&per_page=all`,
    });
    if (catData?.status === "success") {
      setCategs(catData.data?.categories);
      return catData.data?.categories?.map((item: CategoryIndex) => ({
        id: item.id,
        title: item.name,
      }));
    }
    return [];
  };

  useEffect(() => {
    const fetchCategories = async () => {
      await requestSelectOptions();
    };

    fetchCategories();
  }, []);

  return (
    <div className="mb-6 flex flex-col gap-5">
      <div className="flex flex-wrap justify-between gap-4">
        <ProtectComponent
          permission="productsCreate"
          component={
            <Button
              as={Link}
              href={`/panel/products/new/create`}
              color="secondary"
              className="h-[40px] rounded-[5px] bg-accent-2 p-[0_30px] text-[16px] font-[600] text-accent-2-foreground"
            >
              ساخت محصول جدید
            </Button>
          }
        />
        <InputBasic
          name="search"
          type="search"
          placeholder="جستجو..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          endContent={
            <Search
              className="cursor-pointer text-TextMute"
              onClick={() => {
                if (search) {
                  changeFilters("search=" + search);
                } else {
                  deleteFilter("search");
                }
              }}
            />
          }
        />
      </div>

      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
        <SelectSearchCustom
          requestSelectOptions={requestSelectOptions}
          isSearchDisable
          value={
            categFilterValue
              ? [
                  {
                    id: categFilterValue,
                    title:
                      categs?.find((c) => c.id.toString() === categFilterValue)
                        ?.name || "",
                  },
                ]
              : []
          }
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("parent_id=" + selected[0].id.toString());
            } else {
              deleteFilter("parent_id");
            }
          }}
          title="دسته بندی"
        />
        <SelectSearchCustom
          options={[
            { id: "max", title: "بیشترین" },
            { id: "min", title: "کمترین" },
            { id: "latest", title: "جدیدترین" },
            { id: "oldest", title: "قدیمی‌ترین" },
            { id: "most_rate", title: "بیشترین امتیاز" },
            { id: "most_sale", title: "بیشترین فروش" },
          ]}
          isSearchDisable
          title="انتخاب ترتیب"
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("sortBy=" + selected[0].id);
            } else {
              deleteFilter("sortBy");
            }
          }}
          defaultValue={
            sortByFilterValue
              ? [
                  {
                    id: sortByFilterValue,
                    title:
                      sortByFilterValue === "max"
                        ? "بیشترین"
                        : sortByFilterValue === "min"
                          ? "کمترین"
                          : sortByFilterValue === "latest"
                            ? "جدیدترین"
                            : sortByFilterValue === "oldest"
                              ? "قدیمی‌ترین"
                              : sortByFilterValue === "most_rate"
                                ? "بیشترین امتیاز"
                                : sortByFilterValue === "most_sale"
                                  ? "بیشترین فروش"
                                  : "",
                  },
                ]
              : undefined
          }
        />
        <SelectSearchCustom
          options={[
            { id: "0", title: "غیر موجود" },
            { id: "1", title: "موجود" },
          ]}
          title="وضعیت موجودی"
          isSearchDisable
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("exist=" + selected[0].id);
            } else {
              deleteFilter("exist");
            }
          }}
          defaultValue={
            existFilterValue
              ? [
                  {
                    id: existFilterValue,
                    title: existFilterValue === "0" ? "غیر موجود" : "موجود",
                  },
                ]
              : undefined
          }
        />
        <SelectSearchCustom
          options={[
            { id: "0", title: "خير" },
            { id: "1", title: "بله" },
          ]}
          title="پیشنهادي"
          isSearchDisable
          onChange={(selected) => {
            if (selected.length > 0 && selected[0].id !== undefined) {
              changeFilters("offer=" + selected[0].id);
            } else {
              deleteFilter("offer");
            }
          }}
          defaultValue={
            offerFilterValue
              ? [
                  {
                    id: offerFilterValue,
                    title: offerFilterValue === "0" ? "خیر" : "بله",
                  },
                ]
              : undefined
          }
        />
      </div>
    </div>
  );
}
