"use client";
import ShopFilters from "@/app/(website)/shop/_components/ShopFilters";
import BurgerMenu from "@/components/datadisplay/BurgerMenu";
import SelectBox from "@/components/inputs/SelectBox";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { ProductCategoryShowSite, ProductIndexSite } from "@/types/apiTypes";
import { Button } from "@heroui/button";
import { Filter, List } from "lucide-react";
import { useState } from "react";

export default function HeaderFilters({
  product,
}: {
  product: ProductIndexSite | ProductCategoryShowSite["data"];
}) {
  const { changeFilters, deleteFilter, getFilterValue } = useFiltersContext();
  const [burgerOpen, setBurgerOpen] = useState(false);

  return (
    <section>
      <BurgerMenu
        isVisible={burgerOpen}
        closeHandler={() => setBurgerOpen(false)}
      >
        <div className="m-5">
          <ShopFilters />
        </div>
      </BurgerMenu>
      <div className="flex flex-wrap items-center justify-between gap-5 py-5 max-sm:justify-center">
        <Button
          size="sm"
          variant="bordered"
          className="max-md rounded-full border-1 border-primary text-TextColor min-[1247px]:hidden"
          onPress={() => setBurgerOpen((prev) => !prev)}
        >
          <Filter className="w-3" />
          فیلتر ها
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-[25px] w-[25px] items-center justify-center rounded-[8px] border-1 border-primary bg-primary max-md:hidden">
            <List className="w-4 text-primary-foreground" />
          </div>
          <p className="text-TextLow">
            نمایش {product?.meta?.from}–{product?.meta?.to} از{" "}
            {product?.meta?.total} نتیجه
          </p>
        </div>
        <div className="flex flex-wrap-reverse justify-center gap-3">
          <div className="flex items-center gap-3">
            <p>نمایش:</p>
            <p
              className={`cursor-pointer ${product?.meta?.per_page?.toString() === "12" ? `border-b-1 border-TextColor` : ""}`}
              onClick={() => {
                changeFilters("per_page=12");
              }}
            >
              12
            </p>
            <p
              className={`cursor-pointer ${product?.meta?.per_page?.toString() === "15" ? `border-b-1 border-TextColor` : ""}`}
              onClick={() => {
                changeFilters("per_page=15");
              }}
            >
              15
            </p>
            <p
              className={`cursor-pointer ${product?.meta?.per_page?.toString() === "30" ? `border-b-1 border-TextColor` : ""}`}
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
        </div>
      </div>
    </section>
  );
}
