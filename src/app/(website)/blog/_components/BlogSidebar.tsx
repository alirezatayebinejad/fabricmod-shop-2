"use client";
import BlogCardHoriz from "@/app/(website)/_components/cards/BlogCardHoriz";
import InputBasic from "@/components/inputs/InputBasic";
import { useGlobalData } from "@/contexts/GlobalData";
import { useFiltersContext } from "@/contexts/SearchFilters";
import { PostsIndexSite } from "@/types/apiTypes";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { ChevronLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

export default function BlogSidebar({
  blogIndex,
  categSlug,
}: {
  blogIndex?: PostsIndexSite;
  categSlug?: string;
}) {
  const { changeFilters, getFilterValue, deleteFilter } = useFiltersContext();
  const [search, setSearch] = useState("");
  const globalData = useGlobalData();
  const router = useRouter();
  const categSlugValue = categSlug || getFilterValue("category");

  return (
    <section className="pt-7">
      <InputBasic
        name="search"
        type="search"
        placeholder="جستجو..."
        ariaLable="جستجو وبلاگ"
        value={search}
        defaultValue={getFilterValue("search") || ""}
        onChange={(e) => setSearch(e.target.value)}
        endContent={
          <Search
            className="cursor-pointer text-TextMute"
            onClick={() => {
              if (search) changeFilters(["search=" + search, "page=1"]);
              else deleteFilter("search", true);
            }}
          />
        }
      />
      <Accordion selectionMode="multiple" defaultExpandedKeys={["1", "2", "3"]}>
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
              .filter((c) => c.type === "post")
              .map((category) => (
                <Fragment key={category?.slug}>
                  <li
                    className="group mb-1 flex cursor-pointer justify-between"
                    onClick={() => {
                      if (categSlugValue !== category?.slug)
                        router.push(`/blog/category/${category.slug}`);
                    }}
                  >
                    <div className={`flex items-center`}>
                      <ChevronLeft
                        className={`w-4 text-TextMute transition-colors group-hover:text-primary ${categSlugValue === category?.slug ? "text-primary" : ""}`}
                      />
                      <p
                        className={`text-TextSize300 transition-colors group-hover:text-primary ${categSlugValue === category?.slug ? "text-primary" : ""}`}
                      >
                        {category?.name}
                      </p>
                    </div>
                  </li>
                  {category?.childs?.length > 0 && (
                    <div className="border-t-1 border-border py-3 pr-5">
                      {category?.childs.map((subCat) => (
                        <li
                          key={subCat.slug}
                          className="group mb-1 flex cursor-pointer justify-between"
                          onClick={() => {
                            if (categSlugValue !== subCat?.slug)
                              router.push(`/blog/category/${subCat.slug}`);
                          }}
                        >
                          <div className="flex items-center">
                            <div>
                              <ChevronLeft
                                className={`w-4 text-TextMute transition-colors group-hover:text-primary ${
                                  categSlugValue === subCat?.slug
                                    ? "text-primary"
                                    : ""
                                }`}
                              />
                            </div>
                            <p
                              className={`text-TextSize300 text-TextLow transition-colors group-hover:text-primary ${
                                categSlugValue === subCat?.slug
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
        <AccordionItem
          key="2"
          aria-label="آخرین مطالب"
          title="آخرین مطالب"
          classNames={{
            title: "text-TextColor font-bold text-[17px]",
            indicator: "text-TextColor text-[18px]",
          }}
        >
          <div className="flex flex-col gap-1">
            {blogIndex?.latest_posts?.map((post, index) => (
              <BlogCardHoriz tinymode fullSize key={index} blog={post} />
            ))}
          </div>
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="مطالب مهم"
          title="مطالب مهم"
          classNames={{
            title: "text-TextColor font-bold text-[17px]",
            indicator: "text-TextColor text-[18px]",
          }}
        >
          <div className="flex flex-col gap-5">
            {blogIndex?.important_posts?.map((post, index) => (
              <BlogCardHoriz tinymode fullSize key={index} blog={post} />
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
