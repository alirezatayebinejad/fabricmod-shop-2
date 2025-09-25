"use client";
import CategoryCard from "@/app/(website)/(home)/_components/CategoryCard";
import Carousel from "@/components/datadisplay/Carousel";
import { useGlobalData } from "@/contexts/GlobalData";
import { Initials } from "@/types/apiTypes";
import React from "react";

export default function CategoriesCarousel() {
  const gd = useGlobalData();

  // Collect all child categories and parent categories with no childs in order, without using reduce
  type ParentCategory = Initials["categories"][number];
  type ChildCategory = Initials["categories"][number]["childs"][number];
  const allCategories: (ParentCategory | ChildCategory)[] =
    gd?.initials?.categories?.flatMap<ParentCategory | ChildCategory>((cat) =>
      Array.isArray(cat.childs) && cat.childs.length > 0
        ? (cat.childs as ChildCategory[])
        : [cat],
    ) ?? [];

  return (
    <Carousel
      title="دسته بندي ها"
      cards={allCategories.map((child) => (
        <CategoryCard key={child.id} categ={child} />
      ))}
    />
  );
}
