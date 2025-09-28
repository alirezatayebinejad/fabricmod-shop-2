"use client";
import CategoryCard from "@/app/(website)/(home)/_components/CategoryCard";
import Carousel from "@/components/datadisplay/Carousel";
import { useGlobalData } from "@/contexts/GlobalData";
import { Initials } from "@/types/apiTypes";
import React from "react";

export default function CategoriesCarousel() {
  const gd = useGlobalData();
  const parentsIdsHasChild = gd?.initials.categories
    ?.filter((c) => c.childs.length > 0)
    .map((c) => c.slug);
  const categsMinusParentWithChild:
    | Initials["carousel_categories"]
    | undefined = gd?.initials.carousel_categories?.filter(
    (c) => !parentsIdsHasChild?.includes(c.slug),
  );

  return (
    <Carousel
      title="دسته بندي ها"
      cards={
        categsMinusParentWithChild
          ? categsMinusParentWithChild?.map((child) => (
              <CategoryCard key={child.slug} categ={child} />
            ))
          : []
      }
    />
  );
}
