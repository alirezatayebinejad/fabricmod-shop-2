"use client";
import { useHorizOrVert } from "@/app/(website)/_contexts/HorizOrVert";
import BlogSidebar from "@/app/(website)/blog/_components/BlogSidebar";
import BurgerMenu from "@/components/datadisplay/BurgerMenu";
import SelectBox from "@/components/inputs/SelectBox";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { PostsIndexSite } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import { Filter, LayoutGrid, LayoutList, List } from "lucide-react";
import { useState } from "react";

export default function HeaderFilters({
  blogIndex,
  categSlug,
}: {
  blogIndex?: PostsIndexSite;
  categSlug?: string;
}) {
  const { changeFilters, getFilterValue, deleteFilter } = useFiltersContext();
  const [burgerOpen, setBurgerOpen] = useState(false);
  const { viewMode, changeViewMode } = useHorizOrVert();

  return (
    <section>
      <BurgerMenu
        isVisible={burgerOpen}
        closeHandler={() => setBurgerOpen(false)}
      >
        <div className="m-5">
          <BlogSidebar blogIndex={blogIndex} categSlug={categSlug} />
        </div>
      </BurgerMenu>
      <div className="flex flex-wrap items-center justify-between gap-5 py-5 max-sm:justify-center">
        <Button
          variant="bordered"
          className="max-md rounded-full border-1 border-primary text-TextColor min-[1247px]:hidden"
          onPress={() => setBurgerOpen((prev) => !prev)}
        >
          <Filter className="w-3" />
          دسته بندی ها و جستجو
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-[25px] w-[25px] items-center justify-center rounded-[8px] border-1 border-border max-md:hidden">
            <List className="w-4 text-TextLow" />
          </div>
          <p className="text-TextLow">
            نمایش {blogIndex?.meta?.from}–{blogIndex?.meta?.to} از{" "}
            {blogIndex?.meta?.total} نتیجه
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-3">
            <p>نمایش:</p>
            <p
              className={`cursor-pointer ${blogIndex?.meta?.per_page?.toString() === "12" ? `border-b-1 border-TextColor` : ""}`}
              onClick={() => {
                changeFilters("per_page=12");
              }}
            >
              12
            </p>
            <p
              className={`cursor-pointer ${blogIndex?.meta?.per_page?.toString() === "15" ? `border-b-1 border-TextColor` : ""}`}
              onClick={() => {
                changeFilters("per_page=15");
              }}
            >
              15
            </p>
            <p
              className={`cursor-pointer ${blogIndex?.meta?.per_page?.toString() === "30" ? `border-b-1 border-TextColor` : ""}`}
              onClick={() => {
                changeFilters("per_page=30");
              }}
            >
              30
            </p>
          </div>
          <div>
            <SelectBox
              options={[
                { key: "oldest", label: "قدیمی ترین" },
                { key: "latest", label: "جدید ترین" },
                { key: "most_rate", label: "بیشترین امتیاز" },
                { key: "most_view", label: "بیشترین بازدید" },
              ]}
              ariaLabel="مرتب سازی"
              placeholder="مرتب سازی براساس..."
              defaultSelectedKeys={[getFilterValue("sortBy") || ""]}
              onChange={(e) => {
                if (e.target.value) changeFilters("sortBy=" + e.target.value);
                else deleteFilter("sortBy");
              }}
              classNames={{
                base: "min-w-[200px]",
              }}
            />
          </div>
          <div className="flex gap-1.5">
            <Button
              isIconOnly
              variant="bordered"
              onPress={() => changeViewMode("vert")}
              className={`${viewMode === "vert" ? "border-primary bg-primary" : ""} rounded-full border-1 border-border`}
            >
              <LayoutGrid
                className={`${viewMode === "vert" ? "text-primary-foreground" : "text-TextLow"} `}
              />
            </Button>
            <Button
              isIconOnly
              variant="bordered"
              onPress={() => changeViewMode("horiz")}
              className={`${viewMode === "horiz" ? "border-primary bg-primary" : ""} rounded-full border-1 border-border`}
            >
              <LayoutList
                className={`${viewMode === "horiz" ? "text-primary-foreground" : "text-TextLow"} `}
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
