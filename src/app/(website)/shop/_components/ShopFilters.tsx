"use client";
import InputBasic from "@/components/inputs/InputBasic";
import { useGlobalData } from "@/contexts/GlobalData";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { ProductCategoryShowSite } from "@/types/apiTypes";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Checkbox } from "@heroui/checkbox";
import { ChevronLeft, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

export default function ShopFilters({
  mode = "shop",
  categoryAtrributes,
  categorySlug,
}: {
  mode?: "shop" | "category";
  categoryAtrributes?: ProductCategoryShowSite["attributes"];
  categorySlug?: string;
}) {
  const { changeFilters, resetFilters, getFilterValue, deleteFilter } =
    useFiltersContext();
  const [search, setSearch] = useState("");
  const categFilter = getFilterValue("category");
  const globalData = useGlobalData();
  const router = useRouter();

  const activeFilters = [
    { key: "category", label: "دسته بندی" },
    { key: "sortBy", label: "مرتب سازی" },
    { key: "offer", label: "تخفیف" },
    { key: "search", label: "جستجو" },
    { key: "exist", label: "موجود" },
    ...(mode === "category" && categoryAtrributes
      ? categoryAtrributes.map((attr) => ({
          key: `attr[${attr.id}]`,
          label: attr.name,
        }))
      : []),
  ].filter((filter) => getFilterValue(filter.key));
  const handleSearch = () => {
    if (search) changeFilters(["search=" + search, "page=1"]);
    else deleteFilter("search", true);
  };
  return (
    <section className="pt-7">
      <InputBasic
        name="search"
        type="search"
        placeholder="جستجو..."
        ariaLable="جستجو محصول"
        value={search}
        defaultValue={getFilterValue("search") || ""}
        onChange={(e) => setSearch(e.target.value)}
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
      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={["0", "1", "2", "3"]}
      >
        <AccordionItem
          key="0"
          aria-label="فيلتر های فعال"
          title="فيلتر های فعال"
          classNames={{
            title: "text-TextColor font-bold text-[17px]",
            indicator: "text-TextColor text-[18px]",
          }}
        >
          <ul className="flex flex-wrap gap-2">
            {activeFilters?.map((filter, index) => (
              <li
                key={index}
                className="flex items-center rounded-[16px] bg-boxBg300 px-2"
              >
                <X
                  className="w-4 cursor-pointer text-TextMute transition-colors hover:text-TextColor"
                  onClick={() => deleteFilter(filter.key, true)}
                />
                <p className="text-TextSize300 text-TextColor">
                  {filter.label}
                </p>
              </li>
            ))}
            {activeFilters.length > 0 ? (
              <li
                onClick={resetFilters}
                className="flex items-center rounded-[16px] bg-primary-200 px-2 transition-colors hover:bg-primary"
              >
                <p className="cursor-pointer border-primary text-TextSize300 text-TextColor transition-colors hover:text-primary-foreground">
                  حذف همه
                </p>
              </li>
            ) : (
              <p className="text-TextSize300 text-TextMute">فیلتری فعال نیست</p>
            )}
          </ul>
        </AccordionItem>
        <AccordionItem
          key="1"
          aria-label="دسته بندی ها"
          title="دسته بندی ها"
          classNames={{
            title: "text-TextColor font-bold text-[17px]",
            indicator: "text-TextColor text-[18px]",
          }}
        >
          <ul>
            {globalData?.initials?.categories
              ?.filter((cat) => cat.type === "product")
              .map((cat) => (
                <Fragment key={cat.id}>
                  <li
                    className="group mb-1 flex cursor-pointer justify-between"
                    onClick={() => {
                      if (mode === "category") {
                        router.push("/shop/category/" + cat.slug);
                      } else {
                        if (categFilter === cat.slug)
                          deleteFilter("category", true);
                        else changeFilters(["category=" + cat.slug, "page=1"]);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <ChevronLeft
                        className={`w-4 text-TextMute transition-colors group-hover:text-primary ${
                          categFilter === cat?.slug ||
                          categFilter === categorySlug
                            ? "text-primary"
                            : ""
                        }`}
                      />
                      <p
                        className={`text-TextSize300 transition-colors group-hover:text-primary ${
                          categFilter === cat.slug || cat.slug === categorySlug
                            ? "text-primary"
                            : ""
                        }`}
                      >
                        {cat.name}
                      </p>
                    </div>
                  </li>
                  {cat.childs?.length > 0 && (
                    <div className="border-t-1 border-border py-3 pr-5">
                      {cat.childs.map((subCat) => (
                        <li
                          key={subCat.slug}
                          className="group mb-1 flex cursor-pointer justify-between"
                          onClick={() => {
                            if (mode === "category") {
                              router.push("/shop/category/" + subCat.slug);
                            } else {
                              if (categFilter === subCat?.slug)
                                deleteFilter("category", true);
                              else
                                changeFilters([
                                  "category=" + subCat.slug,
                                  "page=1",
                                ]);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <div>
                              <ChevronLeft
                                className={`w-4 text-TextMute transition-colors group-hover:text-primary ${
                                  categFilter === subCat.slug ||
                                  subCat.slug === categorySlug
                                    ? "text-primary"
                                    : ""
                                }`}
                              />
                            </div>
                            <p
                              className={`text-TextSize300 text-TextLow transition-colors group-hover:text-primary ${
                                categFilter === subCat.slug ||
                                subCat.slug === categorySlug
                                  ? "text-primary"
                                  : ""
                              }`}
                            >
                              {subCat.name}
                            </p>
                          </div>
                        </li>
                      ))}
                    </div>
                  )}
                </Fragment>
              ))}
          </ul>
        </AccordionItem>
        {mode === "category" && categoryAtrributes ? (
          <AccordionItem
            key="2"
            aria-label="ویژگی ها"
            title="ویژگی ها"
            classNames={{
              title: "text-TextColor font-bold text-[17px]",
              indicator: "text-TextColor text-[18px]",
            }}
          >
            <ul>
              {categoryAtrributes.map((attribute) => (
                <li key={attribute.id}>
                  <h4 className="py-2 font-bold">{attribute.name}:</h4>
                  <ul>
                    {attribute.values?.map((value) => {
                      const attrFilter = getFilterValue(
                        `attr[${attribute.id}]`,
                      );
                      const attrValues = attrFilter
                        ? attrFilter.split("-")
                        : [];
                      return (
                        <li key={value.value}>
                          <Checkbox
                            size="sm"
                            isSelected={attrValues.includes(value.value)}
                            onValueChange={(isChecked) => {
                              const updatedValues = isChecked
                                ? [...attrValues, value.value]
                                : attrValues.filter((v) => v !== value.value);
                              const newFilterValue = updatedValues.join("-");
                              if (newFilterValue) {
                                changeFilters(
                                  `attr[${attribute.id}]=${newFilterValue}`,
                                );
                              } else {
                                deleteFilter(`attr[${attribute.id}]`);
                              }
                            }}
                          >
                            {value.value}
                          </Checkbox>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </AccordionItem>
        ) : null}
        <AccordionItem
          key="3"
          aria-label="نمایش"
          title="نمایش"
          classNames={{
            title: "text-TextColor font-bold text-[17px]",
            indicator: "text-TextColor text-[18px]",
          }}
        >
          <ul>
            <li>
              <Checkbox
                size="sm"
                isSelected={getFilterValue("exist") === "1" ? true : false}
                onValueChange={(isChecked) =>
                  isChecked ? changeFilters(`exist=1`) : deleteFilter("exist")
                }
              >
                فقط موجود ها
              </Checkbox>
            </li>
            <li>
              <Checkbox
                size="sm"
                isSelected={getFilterValue("offer") === "1" ? true : false}
                onValueChange={(isChecked) =>
                  isChecked ? changeFilters(`offer=1`) : deleteFilter("offer")
                }
              >
                فقط تخفیف خورده ها
              </Checkbox>
            </li>
          </ul>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
