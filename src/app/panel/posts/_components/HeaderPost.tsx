"use client";

import InputBasic from "@/components/inputs/InputBasic";
import SelectSearchCustom from "@/components/inputs/SelectSearchCustom";
import ProtectComponent from "@/components/wrappers/ProtectComponent";
import { useFiltersContext } from "@/contexts/SearchFilters";
import apiCRUD from "@/services/apiCRUD";
import { CategoryIndex } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeaderPost() {
  const { changeFilters, getFilterValue, deleteFilter } = useFiltersContext();
  const sortByFilterValue = getFilterValue("sortBy");
  const categFilterValue = getFilterValue("parent_id");
  const [categs, setCategs] = useState<CategoryIndex[]>();
  const [search, setSearch] = useState("");

  const requestSelectOptions = async () => {
    const catData = await apiCRUD({
      urlSuffix: `admin-panel/categories?type=post&per_page=all`,
    });
    if (catData?.status === "success") {
      setCategs(catData.data?.categories);
      const c = catData.data?.categories?.map((item: CategoryIndex) => ({
        id: item.id,
        title: item.name,
      }));
      return c;
    }
    return [];
  };

  useEffect(() => {
    const fetchCategories = async () => {
      await requestSelectOptions();
    };

    fetchCategories();
  }, []);

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
        permission="postsCreate"
        component={
          <Button
            color="secondary"
            as={Link}
            href={`/panel/posts/create`}
            className="h-[40px] rounded-[5px] bg-accent-2 p-[0_30px] text-[16px] font-[600] text-accent-2-foreground"
          >
            ساخت پست جدید
          </Button>
        }
      />
      <div className="my-6 flex flex-wrap items-center justify-between gap-5">
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

        <div className="flex gap-2 max-md:flex-wrap lg:min-w-[300px]">
          <SelectSearchCustom
            options={[
              { id: "latest", title: "جدیدترین" },
              { id: "oldest", title: "قدیمی‌ترین" },
              { id: "most_rate", title: "بیشترین امتیاز" },
              { id: "most_view", title: "بیشترین بازدید" },
            ]}
            placeholder="انتخاب ترتیب"
            isSearchDisable
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
                        sortByFilterValue === "latest"
                          ? "جدیدترین"
                          : sortByFilterValue === "oldest"
                            ? "قدیمی‌ترین"
                            : sortByFilterValue === "most_rate"
                              ? "بیشترین امتیاز"
                              : sortByFilterValue === "most_view"
                                ? "بیشترین بازدید"
                                : "",
                    },
                  ]
                : undefined
            }
          />
          <SelectSearchCustom
            requestSelectOptions={requestSelectOptions}
            isSearchDisable
            value={
              categFilterValue
                ? [
                    {
                      id: categFilterValue,
                      title:
                        categs?.find(
                          (c) => c.id.toString() === categFilterValue,
                        )?.name || "",
                    },
                  ]
                : []
            }
            onChange={(selected) => {
              if (selected.length > 0 && selected[0].id !== undefined) {
                changeFilters("category_id=" + selected[0].id.toString());
              } else {
                deleteFilter("category_id");
              }
            }}
            placeholder="دسته بندي"
          />
        </div>
      </div>
    </div>
  );
}
